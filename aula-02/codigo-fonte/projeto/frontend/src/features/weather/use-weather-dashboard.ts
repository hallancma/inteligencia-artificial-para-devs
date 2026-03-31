import {
  startTransition,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
} from 'react'

import {
  formatLocationName,
  getDailyForecast,
  getHourlyForecast,
  getTemperatureRange,
  getUvDescriptor,
  getWeatherAppearance,
  temperatureToGradient,
  type WeatherResponse,
} from '@/lib/weather'

export type LoadState = 'idle' | 'loading' | 'success' | 'error'
export type RequestMode = 'city' | 'geo' | null

type WeatherParams =
  | { city: string; latitude?: never; longitude?: never }
  | { city?: never; latitude: number; longitude: number }

export const DEFAULT_CITY = 'São Paulo'

export function useWeatherDashboard() {
  const [query, setQuery] = useState(DEFAULT_CITY)
  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [loadState, setLoadState] = useState<LoadState>('idle')
  const [requestMode, setRequestMode] = useState<RequestMode>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedTemperature, setSelectedTemperature] = useState(22)

  const hourlyForecast = useMemo(() => (weather ? getHourlyForecast(weather, 12) : []), [weather])
  const dailyForecast = useMemo(() => (weather ? getDailyForecast(weather) : []), [weather])
  const temperatureRange = useMemo(() => getTemperatureRange(dailyForecast), [dailyForecast])

  const activeAppearance = useMemo(
    () => getWeatherAppearance(weather?.current.weather_code ?? 1, weather?.current.is_day === 1 || !weather),
    [weather],
  )

  const uvDescriptor = useMemo(
    () => getUvDescriptor(weather?.current.uv_index ?? 0),
    [weather],
  )

  const backgroundStyle = useMemo<CSSProperties>(
    () => ({ backgroundImage: temperatureToGradient(selectedTemperature) }),
    [selectedTemperature],
  )

  const locationLabel = useMemo(
    () => (weather ? formatLocationName(weather.location) : 'Sincronizando clima'),
    [weather],
  )

  const isLoading = loadState === 'loading'
  const citySearchPending = isLoading && requestMode === 'city'
  const geolocationPending = isLoading && requestMode === 'geo'
  const hasError = loadState === 'error' && Boolean(errorMessage)

  async function requestWeather(params: WeatherParams, mode: Exclude<RequestMode, null>) {
    const searchParams = new URLSearchParams()

    if ('city' in params && typeof params.city === 'string') {
      searchParams.set('city', params.city)
    } else {
      searchParams.set('latitude', String(params.latitude))
      searchParams.set('longitude', String(params.longitude))
    }

    setLoadState('loading')
    setRequestMode(mode)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/weather?${searchParams.toString()}`)
      const payload = (await response.json()) as WeatherResponse | { error?: string }

      if (!response.ok) {
        const message =
          'error' in payload && payload.error
            ? payload.error
            : 'Não foi possível carregar o clima agora.'
        throw new Error(message)
      }

      const nextWeather = payload as WeatherResponse

      startTransition(() => {
        setWeather(nextWeather)
        setSelectedTemperature(nextWeather.current.temperature_2m)
        setLoadState('success')
        setRequestMode(null)
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro inesperado ao consultar o clima.'
      setLoadState('error')
      setRequestMode(null)
      setErrorMessage(
        message === 'Cidade não encontrada'
          ? 'Não encontrei essa cidade. Revise o nome e tente novamente.'
          : message,
      )
    }
  }

  useEffect(() => {
    void requestWeather({ city: DEFAULT_CITY }, 'city')
  }, [])

  function submitCitySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedQuery = query.trim()
    if (!normalizedQuery) {
      setErrorMessage('Digite uma cidade para buscar a previsão.')
      setLoadState('error')
      return
    }

    void requestWeather({ city: normalizedQuery }, 'city')
  }

  function retryLastRequest() {
    if (weather) {
      void requestWeather(
        {
          latitude: weather.location.latitude,
          longitude: weather.location.longitude,
        },
        'geo',
      )
      return
    }

    void requestWeather({ city: query.trim() || DEFAULT_CITY }, 'city')
  }

  function requestGeolocation() {
    if (!navigator.geolocation) {
      setLoadState('error')
      setErrorMessage('Geolocalização não está disponível neste navegador.')
      return
    }

    setLoadState('loading')
    setRequestMode('geo')
    setErrorMessage(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void requestWeather(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          'geo',
        )
      },
      () => {
        setLoadState('error')
        setRequestMode(null)
        setErrorMessage('Não foi possível acessar sua localização. Verifique a permissão e tente de novo.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return {
    query,
    setQuery,
    weather,
    loadState,
    requestMode,
    errorMessage,
    selectedTemperature,
    setSelectedTemperature,
    hourlyForecast,
    dailyForecast,
    temperatureRange,
    activeAppearance,
    uvDescriptor,
    backgroundStyle,
    locationLabel,
    isLoading,
    citySearchPending,
    geolocationPending,
    hasError,
    actions: {
      submitCitySearch,
      retryLastRequest,
      requestGeolocation,
    },
  }
}
