import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, CloudRain, Sun } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "@/context/locale-context";

type WeatherData = {
  temperature: number;
  humidity: number;
  rainForecast: string;
};

type WeatherWidgetProps = {
  weather: WeatherData;
};

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  const { t } = useLocale();
  const isLoading = weather.temperature === 0;
  
  const getForecastIcon = () => {
    if (weather.rainForecast.toLowerCase().includes('rain') || weather.rainForecast.toLowerCase().includes('showers') || weather.rainForecast.toLowerCase().includes('thunderstorms') || weather.rainForecast.includes('सरींची') || weather.rainForecast.includes('மழை') || weather.rainForecast.includes('వర్షం')) {
      return <CloudRain className="h-6 w-6 text-blue-400" />;
    }
    return <Sun className="h-6 w-6 text-yellow-400" />;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">{t('localWeather')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Thermometer className="h-5 w-5" />
                <span>{t('temperature')}</span>
              </div>
              <span className="font-bold">{weather.temperature}°C</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Droplets className="h-5 w-5" />
                <span>{t('humidity')}</span>
              </div>
              <span className="font-bold">{weather.humidity}%</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                {getForecastIcon()}
                <span>{t('forecast')}</span>
              </div>
              <span className="font-bold">{weather.rainForecast}</span>
            </li>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
