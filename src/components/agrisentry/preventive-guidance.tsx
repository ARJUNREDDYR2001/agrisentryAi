'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/context/locale-context";
import { ShieldCheck, CloudDrizzle, Flame, Wind } from 'lucide-react';

type WeatherData = {
  temperature: number;
  humidity: number;
  rainForecast: string;
};

type PreventiveGuidanceProps = {
  weather: WeatherData;
};

export default function PreventiveGuidance({ weather }: PreventiveGuidanceProps) {
  const { t } = useLocale();

  const getPreventiveAdvice = ({ temperature, humidity, rainForecast }: WeatherData) => {
    const adviceList = [];
  
    if (humidity > 80) {
      adviceList.push({
        Icon: CloudDrizzle,
        title: t('highHumidityAlert'),
        text: t('highHumidityAlertDesc'),
      });
    }
  
    if (rainForecast.toLowerCase().includes('rain') || rainForecast.toLowerCase().includes('showers') || rainForecast.includes('सरींची') || rainForecast.includes('மழை') || rainForecast.includes('వర్షం') || rainForecast.includes('ಮಳೆ')) {
      adviceList.push({
        Icon: CloudDrizzle,
        title: t('rainForecasted'),
        text: t('rainForecastedDesc'),
      });
    }
  
    if (temperature > 30) {
      adviceList.push({
        Icon: Flame,
        title: t('highTemperatures'),
        text: t('highTemperaturesDesc'),
      });
    }
  
    if (adviceList.length === 0) {
      adviceList.push({
        Icon: ShieldCheck,
        title: t('favorableConditions'),
        text: t('favorableConditionsDesc'),
      });
    }
    
    adviceList.push({
      Icon: Wind,
      title: t('generalTip'),
      text: t('generalTipDesc'),
    });
  
    return adviceList;
  };
  
  const advice = getPreventiveAdvice(weather);

  return (
    <Card className="h-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-primary">{t('preventiveGuidanceTitle')}</CardTitle>
        <CardDescription>{t('preventiveGuidanceDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {advice.map((item, index) => (
          <div key={index} className="flex items-start gap-4 p-4 bg-background rounded-lg border">
            <item.Icon className="h-8 w-8 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
