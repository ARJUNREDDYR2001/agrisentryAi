'use client';

import { useState, useEffect } from 'react';
import type { DiagnosePlantDiseaseOutput } from '@/ai/flows/diagnose-plant-disease';
import { useToast } from "@/hooks/use-toast";
import { runDiagnosis } from '@/app/actions';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/agrisentry/header';
import WeatherWidget from '@/components/agrisentry/weather-widget';
import DiseaseInfo from '@/components/agrisentry/disease-info';
import DiagnosisForm from '@/components/agrisentry/diagnosis-form';
import DiagnosisResult from '@/components/agrisentry/diagnosis-result';
import DiagnosisLoadingSkeleton from '@/components/agrisentry/diagnosis-loading-skeleton';

type WeatherData = {
  temperature: number;
  humidity: number;
  rainForecast: string;
};

export default function AgriSentryDashboard() {
  const [result, setResult] = useState<DiagnosePlantDiseaseOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData>({ temperature: 0, humidity: 0, rainForecast: '' });
  const { toast } = useToast();

  useEffect(() => {
    setWeather({
      temperature: Math.floor(Math.random() * (35 - 25 + 1)) + 25,
      humidity: Math.floor(Math.random() * (90 - 60 + 1)) + 60,
      rainForecast: ['No rain', 'Light showers expected', 'Chance of thunderstorms'][Math.floor(Math.random() * 3)],
    });
  }, []);

  const handleReset = () => {
    setResult(null);
    setIsLoading(false);
  };

  const handleSubmit = async (formData: FormData) => {
    if (isLoading) return;

    setIsLoading(true);
    
    formData.append('temperature', weather.temperature.toString());
    formData.append('humidity', weather.humidity.toString());
    formData.append('rainForecast', weather.rainForecast);

    const { data, error } = await runDiagnosis(formData);

    if (data) {
      setResult(data);
    } else if (error) {
      toast({
        variant: "destructive",
        title: "Diagnosis Failed",
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
            <Card className="h-full shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary">Disease Diagnosis</CardTitle>
                <CardDescription>Upload a photo of the affected plant to get an AI-powered diagnosis.</CardDescription>
              </CardHeader>
              <CardContent className="min-h-[400px]">
                {isLoading ? (
                  <DiagnosisLoadingSkeleton />
                ) : result ? (
                  <DiagnosisResult result={result} onReset={handleReset} />
                ) : (
                  <DiagnosisForm onSubmit={handleSubmit} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>AgriSentryAI &copy; {new Date().getFullYear()} - Your Climate-Aware Farm Guardian</p>
      </footer>
    </div>
  );
}
