import { useEffect, useState } from 'react'
import { WeatherPanel } from './components/WeatherPanel'
import { CloudRain } from 'lucide-react'

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
        return 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]'
      case 'offline':
        return 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]'
      case 'checking':
        return 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative px-4 overflow-hidden font-sans text-slate-100">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      <div className="z-10 flex flex-col items-center w-full max-w-4xl">
        <div className="flex items-center gap-3 mb-10 animate-fade-in">
          <CloudRain className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 drop-shadow-sm">
            ClimaTech
          </h1>
        </div>

        <WeatherPanel />
      </div>

      <div className="absolute bottom-6 flex items-center gap-3 px-5 py-2.5 glass-dark rounded-full z-10 transition-all hover:bg-slate-800/50 cursor-default animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor()} animate-pulse`}></div>
        <span className="text-sm text-slate-300 font-medium tracking-wide">
          API: {apiStatus === 'online' ? 'Conectado' : apiStatus === 'offline' ? 'Desconectado' : 'Verificando...'}
        </span>
      </div>
    </div>
  )
}

export default App
