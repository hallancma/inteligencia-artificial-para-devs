import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
} from 'lucide-react';
import { getWeatherCondition } from '@/lib/weather-utils';

function WeatherIcon({ code, size = 48 }: { code: number; size?: number }) {
  const condition = getWeatherCondition(code);

  const iconProps = { size, strokeWidth: 1.5 };

  switch (condition) {
    case 'clear':
      return (
        <div className="animate-spin-slow">
          <Sun {...iconProps} className="text-yellow-300 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]" />
        </div>
      );
    case 'partly-cloudy':
      return (
        <div className="animate-float">
          <CloudSun {...iconProps} className="text-yellow-200 drop-shadow-[0_0_8px_rgba(250,204,21,0.3)]" />
        </div>
      );
    case 'cloudy':
      return (
        <div className="animate-float">
          <Cloud {...iconProps} className="text-gray-300" />
        </div>
      );
    case 'fog':
      return (
        <div className="animate-float opacity-80">
          <CloudFog {...iconProps} className="text-gray-400" />
        </div>
      );
    case 'drizzle':
      return (
        <div className="animate-bounce-gentle">
          <CloudDrizzle {...iconProps} className="text-blue-300" />
        </div>
      );
    case 'rain':
      return (
        <div className="animate-bounce-gentle">
          <CloudRain {...iconProps} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]" />
        </div>
      );
    case 'snow':
      return (
        <div className="animate-float">
          <CloudSnow {...iconProps} className="text-sky-200 drop-shadow-[0_0_8px_rgba(186,230,253,0.5)]" />
        </div>
      );
    case 'thunderstorm':
      return (
        <div className="animate-flash">
          <CloudLightning {...iconProps} className="text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]" />
        </div>
      );
  }
}

export default WeatherIcon;
