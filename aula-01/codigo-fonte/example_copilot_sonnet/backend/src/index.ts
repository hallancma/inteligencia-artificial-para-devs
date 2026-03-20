import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    description: string;
  }>;
}

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/weather', async (req: Request, res: Response) => {
  try {
    const { city, lat, lon } = req.query;
    
    if (!city && (!lat || !lon)) {
      return res.status(400).json({ 
        error: 'Either city name or coordinates (lat, lon) must be provided' 
      });
    }

    let latitude: number;
    let longitude: number;
    let cityName: string;
    let country: string;

    if (city) {
      // Geocoding API to get coordinates from city name
      const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city as string)}&count=1&language=en&format=json`;
      
      const geocodingResponse = await fetch(geocodingUrl);
      const geocodingData = await geocodingResponse.json();
      
      if (!geocodingData.results || geocodingData.results.length === 0) {
        return res.status(404).json({ 
          error: 'City not found' 
        });
      }

      const location: GeocodingResult = geocodingData.results[0];
      latitude = location.latitude;
      longitude = location.longitude;
      cityName = location.name;
      country = location.country;
    } else {
      // Use provided coordinates
      latitude = parseFloat(lat as string);
      longitude = parseFloat(lon as string);
      cityName = 'Current Location';
      country = '';
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ 
          error: 'Invalid coordinates provided' 
        });
      }
    }

    // Weather API to get current weather and forecast
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;
    
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    
    if (!weatherResponse.ok) {
      return res.status(500).json({ 
        error: 'Failed to fetch weather data' 
      });
    }

    // Map weather codes to descriptions
    const getWeatherDescription = (code: number): string => {
      const weatherCodes: { [key: number]: string } = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
      };
      return weatherCodes[code] || 'Unknown';
    };

    const current = weatherData.current;
    const daily = weatherData.daily;

    const forecast = daily.time.slice(0, 5).map((date: string, index: number) => ({
      date,
      maxTemp: Math.round(daily.temperature_2m_max[index]),
      minTemp: Math.round(daily.temperature_2m_min[index]),
      description: getWeatherDescription(daily.weather_code[index])
    }));

    const weatherResult: WeatherData = {
      city: cityName,
      country,
      temperature: Math.round(current.temperature_2m),
      description: getWeatherDescription(daily.weather_code[0]),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
      pressure: Math.round(current.surface_pressure),
      forecast
    };

    res.json(weatherResult);

  } catch (error) {
    console.error('Weather API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});