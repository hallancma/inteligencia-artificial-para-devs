import { useEffect, useState } from 'react'
import WeatherPanel from './components/WeatherPanel'

type ApiStatus = 'checking' | 'online' | 'offline'

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking')

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/health')
        if (response.ok) {
          setApiStatus('online')
        } else {
          setApiStatus('offline')
        }
      } catch {
        setApiStatus('offline')
      }
    }

    checkApiStatus()
    const interval = setInterval(checkApiStatus, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'online':
        return 'bg-green-500'
      case 'offline':
        return 'bg-red-500'
      case 'checking':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleLocationRequest = (lat: number, lon: number) => {
    console.log(`Location requested: ${lat}, ${lon}`)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-2">
            IA para Devs
          </h1>
          <p className="text-lg text-muted-foreground">
            Weather Dashboard
          </p>
        </div>

        {/* API Status Warning */}
        {apiStatus === 'offline' && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-center">
              ⚠️ Backend API is offline. Please start the backend server to use the weather functionality.
            </p>
          </div>
        )}

        {/* Weather Panel */}
        {apiStatus === 'online' && (
          <WeatherPanel onLocationRequest={handleLocationRequest} />
        )}

        {/* Loading State */}
        {apiStatus === 'checking' && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Connecting to backend...</span>
          </div>
        )}

        {/* API Status Indicator */}
        <div className="fixed bottom-8 right-8 flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full backdrop-blur-sm">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
          <span className="text-sm text-muted-foreground font-medium">API Status</span>
        </div>
      </div>
    </div>
  )
}

export default App
