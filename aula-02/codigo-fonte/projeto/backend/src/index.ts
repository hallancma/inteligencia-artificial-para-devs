import cors from 'cors'
import dotenv from 'dotenv'
import express, { type NextFunction, type Request, type Response } from 'express'

import { getWeather, isOpenMeteoError, parseWeatherQuery } from './open-meteo'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/weather', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = parseWeatherQuery(
      typeof req.query.city === 'string' ? req.query.city : undefined,
      typeof req.query.latitude === 'string' ? req.query.latitude : undefined,
      typeof req.query.longitude === 'string' ? req.query.longitude : undefined,
    )

    const weather = await getWeather(query)
    res.json(weather)
  } catch (error) {
    next(error)
  }
})

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (isOpenMeteoError(err)) {
    res.status(err.status).json({
      error: err.message,
    })
    return
  }

  const fallbackMessage = err instanceof Error ? err.message : 'Unknown error'
  console.error(err)

  res.status(500).json({
    error: 'Something went wrong!',
    message: fallbackMessage,
  })
})

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`)
})
