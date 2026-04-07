import React from 'react';
import { Sun, Cloud, CloudSun, CloudDrizzle, CloudLightning, CloudRain, CloudRainWind } from 'lucide-react';

// Data contract for a single hour's forecast
interface HourlyForecastItem {
  id: string;
  time: string;
  temperature: number; // in degrees Fahrenheit
  icon: React.ComponentType; // A React component for the icon
}

const forecastData: HourlyForecastItem[] = [
  { id: 'h1', time: 'Now', temperature: 70, icon: Cloud },
  { id: 'h2', time: '2 PM', temperature: 70, icon: CloudSun },
  { id: 'h3', time: '3 PM', temperature: 70, icon: Sun },
  { id: 'h4', time: '4 PM', temperature: 70, icon: CloudLightning },
  { id: 'h5', time: '5 PM', temperature: 70, icon: CloudDrizzle },
];

export default function WeatherWidget() {
  return (
    <div className="bg-card border rounded-2xl p-6 ">
      
      {/* Widget Header */}
      <div className="flex items-center gap-3 mb-6">
        <Sun className="w-5 h-5 text-yellow-400" />
        <h2 className="text-base font-bold">Hourly Forecast</h2>
      </div>

      {/* Forecast Items Container */}
      <div className="flex gap-4">
        {forecastData.map((item, index) => {
          const isFirstItem = index === 0;
          
          return (
            <div key={item.id} className="flex-1 flex flex-col items-center gap-2">
              {/* Temperature */}
              <div className={`p-1.5 rounded-lg text-xs font-bold ${isFirstItem ? 'bg-neutral-800' : ''}`}>
                {item.temperature}°
              </div>

              {/* Icon */}
              <div className="py-2">
                {/* Use className on the icon component itself */}
                <item.icon  />
              </div>

              {/* Time */}
              <div className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                {item.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}