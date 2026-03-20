export interface WeatherData {
  city: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  elevation: number;
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    uv_index: number;
  };
  current_units: Record<string, string>;
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
  hourly_units: Record<string, string>;
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
  daily_units: Record<string, string>;
}

export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm';

const weatherDescriptions: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Nevoeiro',
  48: 'Nevoeiro com geada',
  51: 'Garoa leve',
  53: 'Garoa moderada',
  55: 'Garoa intensa',
  56: 'Garoa congelante',
  57: 'Garoa congelante intensa',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  66: 'Chuva congelante',
  67: 'Chuva congelante forte',
  71: 'Neve leve',
  73: 'Neve moderada',
  75: 'Neve forte',
  77: 'Grãos de neve',
  80: 'Pancadas leves',
  81: 'Pancadas moderadas',
  82: 'Pancadas fortes',
  85: 'Neve leve',
  86: 'Neve forte',
  95: 'Trovoada',
  96: 'Trovoada com granizo',
  99: 'Trovoada com granizo forte',
};

export function getWeatherDescription(code: number): string {
  return weatherDescriptions[code] || 'Indisponível';
}

export function getWeatherCondition(code: number): WeatherCondition {
  if (code <= 1) return 'clear';
  if (code === 2) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'snow';
  if (code >= 95) return 'thunderstorm';
  return 'cloudy';
}

export function getTemperatureGradient(temp: number): string {
  if (temp < 0) return 'linear-gradient(135deg, #0c1445 0%, #1a1a4e 40%, #0f3460 100%)';
  if (temp < 10) return 'linear-gradient(135deg, #0f3460 0%, #1a508b 40%, #2471a3 100%)';
  if (temp < 18) return 'linear-gradient(135deg, #0e6655 0%, #148f77 40%, #1abc9c 100%)';
  if (temp < 25) return 'linear-gradient(135deg, #1e8449 0%, #27ae60 40%, #58d68d 100%)';
  if (temp < 30) return 'linear-gradient(135deg, #b7950b 0%, #d4ac0d 40%, #f4d03f 100%)';
  if (temp < 36) return 'linear-gradient(135deg, #ba4a00 0%, #dc7633 40%, #eb984e 100%)';
  return 'linear-gradient(135deg, #922b21 0%, #cb4335 40%, #e74c3c 100%)';
}

export function getDefaultGradient(): string {
  return 'linear-gradient(135deg, #4a00e0 0%, #6c3ce0 40%, #8e2de2 100%)';
}

export function getUvLevel(uv: number): { label: string; color: string } {
  if (uv < 3) return { label: 'Baixo', color: '#22c55e' };
  if (uv < 6) return { label: 'Moderado', color: '#eab308' };
  if (uv < 8) return { label: 'Alto', color: '#f97316' };
  if (uv < 11) return { label: 'Muito alto', color: '#ef4444' };
  return { label: 'Extremo', color: '#7c3aed' };
}

export function formatDayName(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Hoje';
  if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã';

  const name = date.toLocaleDateString('pt-BR', { weekday: 'short' });
  return name.charAt(0).toUpperCase() + name.slice(1).replace('.', '');
}

export function getTemperatureBarColor(temp: number): string {
  if (temp < 0) return '#3b82f6';
  if (temp < 10) return '#06b6d4';
  if (temp < 18) return '#14b8a6';
  if (temp < 25) return '#84cc16';
  if (temp < 30) return '#eab308';
  if (temp < 36) return '#f97316';
  return '#ef4444';
}
