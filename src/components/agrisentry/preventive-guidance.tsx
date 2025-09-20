'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, CloudDrizzle, Flame, Wind } from 'lucide-react';

type WeatherData = {
  temperature: number;
  humidity: number;
  rainForecast: string;
};

type PreventiveGuidanceProps = {
  weather: WeatherData;
};

const getPreventiveAdvice = ({ temperature, humidity, rainForecast }: WeatherData) => {
  const adviceList = [];

  if (humidity > 80) {
    adviceList.push({
      Icon: CloudDrizzle,
      title: "High Humidity Alert",
      text: "High humidity increases the risk of fungal diseases like Powdery Mildew and Blight. Ensure good air circulation around plants and consider preventive bio-fungicide sprays if this condition persists.",
    });
  }

  if (rainForecast.toLowerCase().includes('rain') || rainForecast.toLowerCase().includes('showers')) {
    adviceList.push({
      Icon: CloudDrizzle,
      title: "Rain Forecasted",
      text: "Avoid overhead irrigation to prevent leaf wetness. After rain, check for waterlogging and ensure proper drainage to prevent root rot.",
    });
  }

  if (temperature > 30) {
    adviceList.push({
      Icon: Flame,
      title: "High Temperatures",
      text: "High heat can stress plants. Ensure adequate watering, preferably in the early morning or late evening. Applying mulch can help retain soil moisture and keep roots cool.",
    });
  }

  if (adviceList.length === 0) {
    adviceList.push({
      Icon: ShieldCheck,
      title: "Favorable Conditions",
      text: "Current weather conditions are favorable. Continue standard monitoring and good farming practices. Stay vigilant for any changes in plant health.",
    });
  }
  
  adviceList.push({
    Icon: Wind,
    title: "General Tip",
    text: "Always ensure your fields have good air circulation to reduce humidity on leaf surfaces, which discourages many fungal pathogens."
  });

  return adviceList;
};

export default function PreventiveGuidance({ weather }: PreventiveGuidanceProps) {
  const advice = getPreventiveAdvice(weather);

  return (
    <Card className="h-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-primary">Preventive Guidance</CardTitle>
        <CardDescription>Proactive AI-powered advice to protect your crops based on local weather.</CardDescription>
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
