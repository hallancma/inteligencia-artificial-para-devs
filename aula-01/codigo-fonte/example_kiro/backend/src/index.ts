import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Weather endpoint
app.get('/api/weather', async (req: Request, res: Response) => {
  const { city, latitude, longitude } = req.query;

  try {
    let latitudeStr: string, longitudeStr: string, cityName: string;

    if (city && typeof city === 'string') {
      // Geocoding: city -> coordinates
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        return res.status(404).json({ error: 'City not found' });
      }

      latitudeStr = geoData.results[0].latitude.toString();
      longitudeStr = geoData.results[0].longitude.toString();
      cityName = geoData.results[0].name;
    } else if (latitude && longitude) {
      latitudeStr = latitude as string;
      longitudeStr = longitude as string;
      cityName = 'Current Location';
    } else {
      return res.status(400).json({ error: 'City or coordinates required' });
    }

    // Weather: coordinates -> weather data
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitudeStr}&longitude=${longitudeStr}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
    );
    const weatherData = await weatherResponse.json();

    res.json({
      city: cityName,
      current: {
        temperature: weatherData.current.temperature_2m,
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: weatherData.current.wind_speed_10m,
        weatherCode: weatherData.current.weather_code,
      },
      timezone: weatherData.timezone,
    });
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
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