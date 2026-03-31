import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Open-Meteo API URLs
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

interface GeocodingResult {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    timezone: string;
    country: string;
    country_code: string;
  }>;
}

interface WeatherResponse {
  latitude: number;
  longitude: number;
  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  timezone?: string;
}

app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Weather endpoint: ?city=São Paulo OR ?latitude=X&longitude=Y
app.get('/weather', async (req: Request, res: Response) => {
  try {
    const { city, latitude, longitude } = req.query;

    let lat: number;
    let lon: number;
    let locationName: string;
    let timezone: string;

    if (latitude && longitude) {
      // Direct coordinates (e.g. from geolocation)
      lat = parseFloat(latitude as string);
      lon = parseFloat(longitude as string);
      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: 'Invalid latitude or longitude' });
      }
      locationName = 'Sua localização';
      timezone = 'auto';
    } else if (city && (city as string).trim().length >= 2) {
      // Geocoding: city name -> coordinates
      const geoRes = await fetch(
        `${GEOCODING_API}?name=${encodeURIComponent((city as string).trim())}&count=1`,
        { headers: { 'Accept': 'application/json' } }
      );
      const geoData = (await geoRes.json()) as GeocodingResult;

      if (!geoData.results?.length) {
        return res.status(404).json({ error: 'Cidade não encontrada' });
      }

      const loc = geoData.results[0];
      lat = loc.latitude;
      lon = loc.longitude;
      locationName = `${loc.name}, ${loc.country_code}`;
      timezone = loc.timezone;
    } else {
      return res.status(400).json({ error: 'Informe uma cidade (mínimo 2 caracteres) ou latitude e longitude' });
    }

    const weatherParams = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m',
      timezone,
    });

    const weatherRes = await fetch(`${WEATHER_API}?${weatherParams}`);
    const weatherData = (await weatherRes.json()) as WeatherResponse;

    if (!weatherData.current) {
      return res.status(502).json({ error: 'Não foi possível obter dados do clima' });
    }

    return res.json({
      location: locationName,
      timezone: weatherData.timezone,
      current: weatherData.current,
    });
  } catch (err) {
    console.error('Weather error:', err);
    return res.status(500).json({ error: 'Erro ao buscar dados do clima' });
  }
});

app.use((err: Error, _req: Request, res: Response, _next: () => void) => {
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