import {
  CloudDrizzle,
  CloudFog,
  CloudRain,
  CloudSun,
  Cloudy,
  LucideIcon,
  MoonStar,
  Snowflake,
  Sun,
  Zap,
} from 'lucide-react'

export type WeatherResponse = {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  location: {
    name: string
    country: string
    admin1?: string
    latitude: number
    longitude: number
  }
  current_units: {
    temperature_2m: string
    relative_humidity_2m: string
    precipitation: string
    wind_speed_10m: string
    uv_index: string
  }
  current: {
    time: string
    interval: number
    temperature_2m: number
    relative_humidity_2m: number
    precipitation: number
    wind_speed_10m: number
    uv_index: number
    weather_code: number
    is_day: number
  }
  hourly_units: {
    temperature_2m: string
    precipitation_probability: string
    precipitation: string
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: number[]
    precipitation: number[]
    weather_code: number[]
  }
  daily_units: {
    temperature_2m_max: string
    temperature_2m_min: string
    precipitation_sum: string
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_sum: number[]
  }
}

export type HourlyForecast = {
  index: number
  time: string
  label: string
  temperature: number
  precipitationProbability: number
  precipitation: number
  weatherCode: number
}

export type DailyForecast = {
  index: number
  date: string
  label: string
  max: number
  min: number
  precipitation: number
  weatherCode: number
}

export type WeatherAppearance = {
  label: string
  summary: string
  accent: string
  accentSoft: string
  cardTone: string
  stroke: string
  glow: string
  icon: LucideIcon
  iconClassName: string
}

const hourFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: '2-digit',
})

const fullDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
})

export function getHourlyForecast(weather: WeatherResponse, limit = 12): HourlyForecast[] {
  return weather.hourly.time.slice(0, limit).map((time, index) => ({
    index,
    time,
    label: hourFormatter.format(new Date(time)),
    temperature: weather.hourly.temperature_2m[index],
    precipitationProbability: weather.hourly.precipitation_probability[index],
    precipitation: weather.hourly.precipitation[index],
    weatherCode: weather.hourly.weather_code[index],
  }))
}

export function getDailyForecast(weather: WeatherResponse): DailyForecast[] {
  return weather.daily.time.map((date, index) => ({
    index,
    date,
    label: weekdayFormatter.format(new Date(date)),
    max: weather.daily.temperature_2m_max[index],
    min: weather.daily.temperature_2m_min[index],
    precipitation: weather.daily.precipitation_sum[index],
    weatherCode: weather.daily.weather_code[index],
  }))
}

export function getWeatherAppearance(code: number, isDay: boolean): WeatherAppearance {
  if (code === 0) {
    return isDay
      ? {
          label: 'Céu limpo',
          summary: 'Visibilidade ampla e atmosfera estável.',
          accent: '#f59e0b',
          accentSoft: '#fde68a',
          cardTone: 'from-amber-100/90 via-sky-100/70 to-cyan-100/80',
          stroke: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.28)',
          icon: Sun,
          iconClassName: 'animate-[spin_12s_linear_infinite]',
        }
      : {
          label: 'Noite aberta',
          summary: 'Céu estável com poucas nuvens e ar mais seco.',
          accent: '#818cf8',
          accentSoft: '#c7d2fe',
          cardTone: 'from-slate-950/90 via-indigo-950/70 to-sky-950/70',
          stroke: '#818cf8',
          glow: 'rgba(129, 140, 248, 0.3)',
          icon: MoonStar,
          iconClassName: 'animate-[pulse_4s_ease-in-out_infinite]',
        }
  }

  if ([1, 2, 3].includes(code)) {
    return {
      label: 'Nebulosidade variável',
      summary: 'Camadas de nuvens filtram a luz e deixam o clima mais suave.',
      accent: '#38bdf8',
      accentSoft: '#bfdbfe',
      cardTone: 'from-sky-100/80 via-slate-100/80 to-zinc-200/80',
      stroke: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.24)',
      icon: code === 1 ? CloudSun : Cloudy,
      iconClassName: 'animate-[pulse_6s_ease-in-out_infinite]',
    }
  }

  if ([45, 48].includes(code)) {
    return {
      label: 'Nevoeiro',
      summary: 'Baixa visibilidade com umidade suspensa próxima ao solo.',
      accent: '#94a3b8',
      accentSoft: '#e2e8f0',
      cardTone: 'from-slate-200/85 via-zinc-100/75 to-slate-300/85',
      stroke: '#94a3b8',
      glow: 'rgba(148, 163, 184, 0.22)',
      icon: CloudFog,
      iconClassName: 'animate-[pulse_5s_ease-in-out_infinite]',
    }
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return {
      label: 'Garoa',
      summary: 'Chuva fina persistente com baixa intensidade.',
      accent: '#0ea5e9',
      accentSoft: '#bae6fd',
      cardTone: 'from-sky-200/85 via-cyan-100/75 to-blue-100/85',
      stroke: '#0ea5e9',
      glow: 'rgba(14, 165, 233, 0.26)',
      icon: CloudDrizzle,
      iconClassName: 'animate-[bounce_3.5s_ease-in-out_infinite]',
    }
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return {
      label: 'Chuva',
      summary: 'Umidade alta e precipitação relevante nas próximas horas.',
      accent: '#2563eb',
      accentSoft: '#bfdbfe',
      cardTone: 'from-blue-200/85 via-sky-100/75 to-slate-200/85',
      stroke: '#2563eb',
      glow: 'rgba(37, 99, 235, 0.25)',
      icon: CloudRain,
      iconClassName: 'animate-[bounce_2.8s_ease-in-out_infinite]',
    }
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return {
      label: 'Neve',
      summary: 'Massa de ar fria com precipitação sólida.',
      accent: '#67e8f9',
      accentSoft: '#cffafe',
      cardTone: 'from-cyan-100/85 via-white/80 to-sky-100/80',
      stroke: '#0891b2',
      glow: 'rgba(103, 232, 249, 0.28)',
      icon: Snowflake,
      iconClassName: 'animate-[spin_8s_linear_infinite]',
    }
  }

  if ([95, 96, 99].includes(code)) {
    return {
      label: 'Tempestade',
      summary: 'Energia atmosférica elevada com descargas e chuva intensa.',
      accent: '#7c3aed',
      accentSoft: '#ddd6fe',
      cardTone: 'from-violet-200/80 via-slate-200/75 to-fuchsia-100/75',
      stroke: '#7c3aed',
      glow: 'rgba(124, 58, 237, 0.24)',
      icon: Zap,
      iconClassName: 'animate-[pulse_1.8s_ease-in-out_infinite]',
    }
  }

  return {
    label: 'Condição estável',
    summary: 'Cenário atmosférico dentro da faixa esperada.',
    accent: '#14b8a6',
    accentSoft: '#99f6e4',
    cardTone: 'from-teal-100/85 via-emerald-50/75 to-cyan-100/80',
    stroke: '#14b8a6',
    glow: 'rgba(20, 184, 166, 0.24)',
    icon: CloudSun,
    iconClassName: 'animate-[pulse_4s_ease-in-out_infinite]',
  }
}

export function formatFullDate(value: string): string {
  return fullDateFormatter.format(new Date(value))
}

export function formatLocationName(location: WeatherResponse['location']): string {
  return [location.name, location.admin1, location.country].filter(Boolean).join(', ')
}

export function getUvDescriptor(uvIndex: number): { label: string; progress: number; color: string } {
  if (uvIndex < 3) {
    return { label: 'Baixo', progress: Math.min(uvIndex / 11, 1), color: '#22c55e' }
  }

  if (uvIndex < 6) {
    return { label: 'Moderado', progress: Math.min(uvIndex / 11, 1), color: '#eab308' }
  }

  if (uvIndex < 8) {
    return { label: 'Alto', progress: Math.min(uvIndex / 11, 1), color: '#f97316' }
  }

  if (uvIndex < 11) {
    return { label: 'Muito alto', progress: Math.min(uvIndex / 11, 1), color: '#ef4444' }
  }

  return { label: 'Extremo', progress: 1, color: '#7c3aed' }
}

export function getTemperatureRange(dailyForecast: DailyForecast[]): { min: number; max: number } {
  return dailyForecast.reduce(
    (range, day) => ({
      min: Math.min(range.min, day.min),
      max: Math.max(range.max, day.max),
    }),
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
  )
}

export function temperatureToGradient(temperature: number): string {
  if (temperature <= 5) {
    return 'linear-gradient(140deg, rgba(224,242,254,1) 0%, rgba(186,230,253,1) 35%, rgba(15,23,42,0.96) 100%)'
  }

  if (temperature <= 16) {
    return 'linear-gradient(140deg, rgba(219,234,254,1) 0%, rgba(125,211,252,0.95) 45%, rgba(14,116,144,0.92) 100%)'
  }

  if (temperature <= 27) {
    return 'linear-gradient(140deg, rgba(254,249,195,1) 0%, rgba(186,230,253,0.9) 45%, rgba(8,145,178,0.92) 100%)'
  }

  return 'linear-gradient(140deg, rgba(254,215,170,1) 0%, rgba(251,146,60,0.92) 38%, rgba(153,27,27,0.88) 100%)'
}
