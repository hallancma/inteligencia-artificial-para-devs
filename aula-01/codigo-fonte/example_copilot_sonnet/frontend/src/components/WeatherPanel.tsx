import { useState } from 'react'
import { MapPin, Search, Thermometer, Droplets, Wind, Gauge, Calendar } from 'lucide-react'

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

interface WeatherPanelProps {
  onLocationRequest?: (lat: number, lon: number) => void;
}

export default function WeatherPanel({ onLocationRequest }: WeatherPanelProps) {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = async (searchCity?: string, lat?: number, lon?: number) => {
    setLoading(true)
    setError('')
    
    try {
      let url = 'http://localhost:3000/weather'
      const params = new URLSearchParams()
      
      if (searchCity) {
        params.append('city', searchCity)
      } else if (lat !== undefined && lon !== undefined) {
        params.append('lat', lat.toString())
        params.append('lon', lon.toString())
      }
      
      const response = await fetch(`${url}?${params}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather data')
      }
      
      setWeather(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim()) {
      fetchWeather(city.trim())
    }
  }

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      return
    }

    setLoading(true)
    setError('')
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchWeather(undefined, latitude, longitude)
        onLocationRequest?.(latitude, longitude)
      },
      (err) => {
        setError('Unable to retrieve your location')
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-lg border">
      <div className="flex items-center gap-2 mb-6">
        <Thermometer className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-foreground">Weather Panel</h2>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !city.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={handleLocationRequest}
            disabled={loading}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Use my location"
          >
            <MapPin className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Weather Display */}
      {weather && !loading && (
        <div className="space-y-6">
          {/* Current Weather */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  {weather.city}
                  {weather.country && (
                    <span className="text-blue-100 ml-2">({weather.country})</span>
                  )}
                </h3>
                <p className="text-blue-100 capitalize">{weather.description}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{weather.temperature}°C</div>
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
              <Droplets className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="font-semibold">{weather.humidity}%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
              <Wind className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Wind Speed</p>
                <p className="font-semibold">{weather.windSpeed} km/h</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
              <Gauge className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pressure</p>
                <p className="font-semibold">{weather.pressure} hPa</p>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast */}
          {weather.forecast && weather.forecast.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <h4 className="font-semibold text-lg">5-Day Forecast</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="p-4 bg-secondary/10 rounded-lg text-center">
                    <p className="font-medium text-sm mb-2">
                      {formatDate(day.date)}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2 capitalize">
                      {day.description}
                    </p>
                    <div className="space-y-1">
                      <p className="text-lg font-bold">{day.maxTemp}°</p>
                      <p className="text-sm text-muted-foreground">{day.minTemp}°</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading weather data...</span>
        </div>
      )}
    </div>
  )
}