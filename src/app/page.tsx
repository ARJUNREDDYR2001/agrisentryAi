'use client';

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { runDiagnosis, type DiagnosisResult } from '@/app/actions';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/agrisentry/header';
import WeatherWidget from '@/components/agrisentry/weather-widget';
import DiseaseInfo from '@/components/agrisentry/disease-info';
import DiagnosisForm from '@/components/agrisentry/diagnosis-form';
import DiagnosisResultComponent from '@/components/agrisentry/diagnosis-result';
import DiagnosisLoadingSkeleton from '@/components/agrisentry/diagnosis-loading-skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, Stethoscope, Telescope } from 'lucide-react';
import PreventiveGuidance from '@/components/agrisentry/preventive-guidance';
import { useLocale } from '@/context/locale-context';
import Chatbot from '@/components/agrisentry/chatbot';
import PestForecast from '@/components/agrisentry/pest-forecast';


type WeatherData = {
  temperature: number;
  humidity: number;
  rainForecast: string;
};

export default function AgriSentryDashboard() {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData>({ temperature: 0, humidity: 0, rainForecast: '' });
  const { toast } = useToast();
  const { t } = useLocale();

  useEffect(() => {
    // Simulate fetching weather data
    const rainForecasts = [t('noRain'), t('lightShowers'), t('chanceOfThunderstorms')];
    setWeather({
      temperature: Math.floor(Math.random() * (35 - 25 + 1)) + 25, // Simulate temps between 25-35°C
      humidity: Math.floor(Math.random() * (90 - 60 + 1)) + 60, // Simulate humidity between 60-90%
      rainForecast: rainForecasts[Math.floor(Math.random() * 3)],
    });
  }, [t]);

  const handleReset = () => {
    setResult(null);
    setIsLoading(false);
  };

  const handleSubmit = async (formData: FormData) => {
    if (isLoading) return;

    setIsLoading(true);
    
    // Append weather data to the form
    formData.append('temperature', weather.temperature.toString());
    formData.append('humidity', weather.humidity.toString());
    formData.append('rainForecast', weather.rainForecast);

    const { data, error } = await runDiagnosis(formData);

    if (data) {
      setResult(data);
    } else if (error) {
      toast({
        variant: "destructive",
        title: t('diagnosisFailed'),
        description: error,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 space-y-8">
            <WeatherWidget weather={weather} />
            <DiseaseInfo />
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="diagnosis" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="diagnosis">
                  <Stethoscope className="mr-2 h-4 w-4"/>
                  {t('diagnosis')}
                </TabsTrigger>
                <TabsTrigger value="forecast">
                  <Telescope className="mr-2 h-4 w-4"/>
                  {t('pestForecast')}
                </TabsTrigger>
                <TabsTrigger value="prevention">
                  <Leaf className="mr-2 h-4 w-4"/>
                  {t('preventiveGuidance')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="diagnosis">
                <Card className="h-full shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-headline text-3xl text-primary">{t('diseaseDiagnosis')}</CardTitle>
                    <CardDescription>{t('diseaseDiagnosisDescription')}</CardDescription>
                  </CardHeader>
                  <CardContent className="min-h-[400px]">
                    {isLoading ? (
                      <DiagnosisLoadingSkeleton />
                    ) : result ? (
                      <DiagnosisResultComponent result={result} onReset={handleReset} />
                    ) : (
                      <DiagnosisForm onSubmit={handleSubmit} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="forecast">
                <PestForecast weather={weather} />
              </TabsContent>
              <TabsContent value="prevention">
                <PreventiveGuidance weather={weather} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Chatbot />
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>AgriSentryAI &copy; {new Date().getFullYear()} - {t('appTagline')}</p>
      </footer>
    </div>
  );
}
