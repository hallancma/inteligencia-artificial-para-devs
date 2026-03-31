const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast'
const REVERSE_GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/reverse'

const CURRENT_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'precipitation',
  'wind_speed_10m',
  'uv_index',
  'weather_code',
  'is_day',
]

const HOURLY_FIELDS = [
  'temperature_2m',
  'precipitation_probability',
  'precipitation',
  'weather_code',
]

const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
]

type LocationQuery =
  | { city: string; latitude?: never; longitude?: never }
  | { city?: never; latitude: number; longitude: number }

type OpenMeteoGeocodingResult = {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
  timezone?: string
}

type OpenMeteoGeocodingResponse = {
  results?: OpenMeteoGeocodingResult[]
}

type OpenMeteoForecastResponse = {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current_units: Record<string, string>
  current: Record<string, number | string>
  hourly_units: Record<string, string>
  hourly: Record<string, Array<number | string>>
  daily_units: Record<string, string>
  daily: Record<string, Array<number | string>>
}

export type WeatherApiResponse = OpenMeteoForecastResponse & {
  location: {
    name: string
    country: string
    admin1?: string
    latitude: number
    longitude: number
  }
}

class OpenMeteoError extends Error {
  status: number

  constructor(message: string, status = 502) {
    super(message)
    this.status = status
  }
}

async function fetchJson<T>(input: string): Promise<T> {
  const response = await fetch(input, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new OpenMeteoError(`Open-Meteo request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

async function resolveLocation(query: LocationQuery): Promise<WeatherApiResponse['location']> {
  if ('city' in query && typeof query.city === 'string') {
    const geocodingUrl = new URL(GEOCODING_API_URL)
    geocodingUrl.searchParams.set('name', query.city)
    geocodingUrl.searchParams.set('count', '1')
    geocodingUrl.searchParams.set('language', 'pt')
    geocodingUrl.searchParams.set('format', 'json')

    const geocodingResponse = await fetchJson<OpenMeteoGeocodingResponse>(geocodingUrl.toString())
    const location = geocodingResponse.results?.[0]

    if (!location) {
      throw new OpenMeteoError('Cidade não encontrada', 404)
    }

    return {
      name: location.name,
      country: location.country,
      admin1: location.admin1,
      latitude: location.latitude,
      longitude: location.longitude,
    }
  }

  const reverseGeocodingUrl = new URL(REVERSE_GEOCODING_API_URL)
  reverseGeocodingUrl.searchParams.set('latitude', String(query.latitude))
  reverseGeocodingUrl.searchParams.set('longitude', String(query.longitude))
  reverseGeocodingUrl.searchParams.set('language', 'pt')
  reverseGeocodingUrl.searchParams.set('format', 'json')

  let location: OpenMeteoGeocodingResult | undefined

  try {
    const reverseGeocodingResponse =
      await fetchJson<OpenMeteoGeocodingResponse>(reverseGeocodingUrl.toString())
    location = reverseGeocodingResponse.results?.[0]
  } catch {
    location = undefined
  }

  if (!location) {
    return {
      name: 'Sua localização',
      country: 'Localização atual',
      latitude: query.latitude,
      longitude: query.longitude,
    }
  }

  return {
    name: location.name,
    country: location.country,
    admin1: location.admin1,
    latitude: query.latitude,
    longitude: query.longitude,
  }
}

export async function getWeather(query: LocationQuery): Promise<WeatherApiResponse> {
  const location = await resolveLocation(query)
  const forecastUrl = new URL(FORECAST_API_URL)

  forecastUrl.searchParams.set('latitude', String(location.latitude))
  forecastUrl.searchParams.set('longitude', String(location.longitude))
  forecastUrl.searchParams.set('current', CURRENT_FIELDS.join(','))
  forecastUrl.searchParams.set('hourly', HOURLY_FIELDS.join(','))
  forecastUrl.searchParams.set('daily', DAILY_FIELDS.join(','))
  forecastUrl.searchParams.set('forecast_days', '7')
  forecastUrl.searchParams.set('timezone', 'auto')

  const forecast = await fetchJson<OpenMeteoForecastResponse>(forecastUrl.toString())

  return {
    ...forecast,
    location,
  }
}

export function parseWeatherQuery(
  city: string | undefined,
  latitude: string | undefined,
  longitude: string | undefined,
): LocationQuery {
  const normalizedCity = city?.trim()

  if (normalizedCity) {
    return { city: normalizedCity }
  }

  if (!latitude || !longitude) {
    throw new OpenMeteoError('Informe uma cidade ou latitude e longitude.', 400)
  }

  const parsedLatitude = Number(latitude)
  const parsedLongitude = Number(longitude)

  if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude)) {
    throw new OpenMeteoError('Latitude e longitude precisam ser numéricas.', 400)
  }

  return {
    latitude: parsedLatitude,
    longitude: parsedLongitude,
  }
}

export function isOpenMeteoError(error: unknown): error is OpenMeteoError {
  return error instanceof OpenMeteoError
}
