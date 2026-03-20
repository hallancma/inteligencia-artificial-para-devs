import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

interface GeocodingResponse {
  results: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
  }>;
}

interface WeatherResponse {
  latitude: number;
  longitude: number;
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    is_day: number;
    time: string;
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relativehumidity_2m: number[];
    apparent_temperature: number[];
  };
}

const getWeatherDescription = (code: number): string => {
  const weatherCodes: { [key: number]: string } = {
    0: 'Céu limpo',
    1: 'Principalmente limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Neblina',
    48: 'Neblina com depósito de gelo',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa intensa',
    56: 'Garoa congelante leve',
    57: 'Garoa congelante intensa',
    61: 'Chuva leve',
    63: 'Chuva moderada',
    65: 'Chuva intensa',
    66: 'Chuva congelante leve',
    67: 'Chuva congelante intensa',
    71: 'Neve leve',
    73: 'Neve moderada',
    75: 'Neve intensa',
    77: 'Grãos de neve',
    80: 'Pancadas de chuva leves',
    81: 'Pancadas de chuva moderadas',
    82: 'Pancadas de chuva intensas',
    85: 'Pancadas de neve leves',
    86: 'Pancadas de neve intensas',
    95: 'Tempestade leve',
    96: 'Tempestade com granizo leve',
    99: 'Tempestade com granizo intensa'
  };
  return weatherCodes[code] || 'Desconhecido';
};

router.get('/weather', async (req: Request, res: Response) => {
  try {
    const { city } = req.query;

    if (!city || typeof city !== 'string') {
      res.status(400).json({ error: 'Parâmetro city é obrigatório' });
      return;
    }

    // Primeiro, obter coordenadas da cidade
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;
    const geocodingResponse = await axios.get<GeocodingResponse>(geocodingUrl);

    if (!geocodingResponse.data.results || geocodingResponse.data.results.length === 0) {
      res.status(404).json({ error: 'Cidade não encontrada' });
      return;
    }

    const location = geocodingResponse.data.results[0];
    const { latitude, longitude, name, country, admin1 } = location;

    // Agora, obter dados do clima
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,relativehumidity_2m,apparent_temperature&timezone=auto`;
    const weatherResponse = await axios.get<WeatherResponse>(weatherUrl);

    // Formatar resposta
    const currentWeather = weatherResponse.data.current_weather;
    const daily = weatherResponse.data.daily;
    const hourly = weatherResponse.data.hourly;
    
    // Encontrar o índice da hora atual
    const currentHour = new Date().getHours();
    const currentHourIndex = hourly.time.findIndex(time => {
      const hour = new Date(time).getHours();
      return hour === currentHour;
    });

    const response = {
      location: {
        name,
        country,
        admin1: admin1 || '',
        latitude,
        longitude
      },
      current: {
        temperature: currentWeather.temperature,
        windSpeed: currentWeather.windspeed,
        windDirection: currentWeather.winddirection,
        weatherCode: currentWeather.weathercode,
        weatherDescription: getWeatherDescription(currentWeather.weathercode),
        isDay: currentWeather.is_day === 1,
        humidity: currentHourIndex >= 0 ? hourly.relativehumidity_2m[currentHourIndex] : null,
        feelsLike: currentHourIndex >= 0 ? hourly.apparent_temperature[currentHourIndex] : null
      },
      forecast: {
        today: {
          max: daily.temperature_2m_max[0],
          min: daily.temperature_2m_min[0],
          weatherCode: daily.weathercode[0],
          weatherDescription: getWeatherDescription(daily.weathercode[0])
        },
        tomorrow: {
          max: daily.temperature_2m_max[1],
          min: daily.temperature_2m_min[1],
          weatherCode: daily.weathercode[1],
          weatherDescription: getWeatherDescription(daily.weathercode[1])
        }
      }
    };

    res.json(response);
    return;
  } catch (error) {
    console.error('Erro ao obter dados do clima:', error);
    res.status(500).json({ error: 'Erro ao obter dados do clima' });
  }
});

export default router;
