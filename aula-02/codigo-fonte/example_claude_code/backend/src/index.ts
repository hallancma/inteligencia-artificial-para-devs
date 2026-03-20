import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/weather', async (req: Request, res: Response) => {
  const city = typeof req.query.city === 'string' ? req.query.city : undefined;
  const lat = typeof req.query.lat === 'string' ? req.query.lat : undefined;
  const lon = typeof req.query.lon === 'string' ? req.query.lon : undefined;

  if (!city && (!lat || !lon)) {
    res.status(400).json({ error: 'Informe uma cidade ou coordenadas (lat, lon)' });
    return;
  }

  try {
    let latitude: number;
    let longitude: number;
    let cityName: string;
    let country: string | undefined;
    let admin1: string | undefined;

    if (city) {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
      );
      const geoData = await geoResponse.json() as { results?: Array<{ latitude: number; longitude: number; name: string; country?: string; admin1?: string }> };

      if (!geoData.results?.length) {
        res.status(404).json({ error: 'Cidade não encontrada' });
        return;
      }

      const result = geoData.results[0];
      latitude = result.latitude;
      longitude = result.longitude;
      cityName = result.name;
      country = result.country;
      admin1 = result.admin1;
    } else {
      latitude = Number(lat);
      longitude = Number(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({ error: 'Coordenadas inválidas' });
        return;
      }

      try {
        const revResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=pt`,
          { headers: { 'User-Agent': 'WeatherDashboard/1.0' } }
        );
        const revData = await revResponse.json() as { address?: { city?: string; town?: string; village?: string; country?: string; state?: string } };
        cityName = revData.address?.city || revData.address?.town || revData.address?.village || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
        country = revData.address?.country;
        admin1 = revData.address?.state;
      } catch {
        cityName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
      }
    }

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
    );
    const weatherData = await weatherResponse.json() as Record<string, unknown>;

    res.json({
      city: cityName,
      country,
      admin1,
      ...weatherData,
    });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar dados do clima' });
  }
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
