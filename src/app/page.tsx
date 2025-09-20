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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, Stethoscope } from 'lucide-react';
import PreventiveGuidance from '@/components/agrisentry/preventive-guidance';


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
    // Simulate fetching weather data
    setWeather({
      temperature: Math.floor(Math.random() * (35 - 25 + 1)) + 25, // Simulate temps between 25-35°C
      humidity: Math.floor(Math.random() * (90 - 60 + 1)) + 60, // Simulate humidity between 60-90%
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
            <Tabs defaultValue="diagnosis" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="diagnosis">
                  <Stethoscope className="mr-2 h-4 w-4"/>
                  Diagnosis
                </TabsTrigger>
                <TabsTrigger value="prevention">
                  <Leaf className="mr-2 h-4 w-4"/>
                  Preventive Guidance
                </TabsTrigger>
              </TabsList>
              <TabsContent value="diagnosis">
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
              </TabsContent>
              <TabsContent value="prevention">
                <PreventiveGuidance weather={weather} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>AgriSentryAI &copy; {new Date().getFullYear()} - Your Climate-Aware Farm Guardian</p>
      </footer>
    </div>
  );
}
