'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/context/locale-context";
import { runForecast } from '@/app/actions';
import type { PestAndDiseaseForecast } from '@/ai/flows/get-pest-disease-forecast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '../ui/button';
import { AlertTriangle, Bug, LoaderCircle, ShieldAlert, Sprout, Telescope } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';

type WeatherData = {
  temperature: number;
  humidity: number;
  rainForecast: string;
};

type PestForecastProps = {
  weather: WeatherData;
};

const commonCrops = ["Tomato", "Rice", "Cotton", "Sugarcane", "Wheat", "Potato", "Chilli"];

export default function PestForecast({ weather }: PestForecastProps) {
  const { t } = useLocale();
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [forecast, setForecast] = useState<PestAndDiseaseForecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunForecast = async () => {
    if (!selectedCrop || isLoading) return;
    setIsLoading(true);
    setError(null);
    setForecast(null);
    
    const { data, error } = await runForecast({
      ...weather,
      crop: selectedCrop
    });

    if (data) {
      setForecast(data);
    } else {
      setError(error || t('forecastError'));
    }
    setIsLoading(false);
  };
  
  const getRiskColor = (score: number) => {
    if (score > 70) return 'bg-destructive';
    if (score > 40) return 'bg-yellow-500';
    return 'bg-primary';
  };
  
  const getRiskIcon = (score: number) => {
    if (score > 70) return <ShieldAlert className="h-6 w-6 text-destructive" />;
    if (score > 40) return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    return <Sprout className="h-6 w-6 text-primary" />;
  }

  return (
    <Card className="h-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-primary">{t('pestForecastTitle')}</CardTitle>
        <CardDescription>{t('pestForecastDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg bg-background">
          <div className="w-full sm:w-auto">
            <Select onValueChange={setSelectedCrop} value={selectedCrop}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('selectCrop')} />
              </SelectTrigger>
              <SelectContent>
                {commonCrops.map(crop => (
                  <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleRunForecast} disabled={!selectedCrop || isLoading} className='w-full sm:w-auto'>
            {isLoading ? <LoaderCircle className="mr-2 animate-spin" /> : <Telescope className="mr-2"/>}
            {t('getForecast')}
          </Button>
        </div>

        <div className='min-h-[250px]'>
          {isLoading && <ForecastLoadingSkeleton />}
          
          {error && <p className="text-destructive text-center">{error}</p>}

          {forecast && (
            <div className="space-y-4">
              {forecast.forecasts.length > 0 ? forecast.forecasts.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-background rounded-lg border">
                  <div className='pt-1'>
                    {getRiskIcon(item.riskScore)}
                  </div>
                  <div className='flex-grow'>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold flex items-center gap-2">
                        {item.type === 'pest' ? <Bug className='h-4 w-4'/> : <Sprout className='h-4 w-4'/>}
                        {item.name}
                      </h3>
                      <span className='text-xs text-muted-foreground font-mono'>{item.timeline}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-muted-foreground">{t('riskScore')}</span>
                      <span className="text-sm font-bold">{item.riskScore}%</span>
                    </div>
                    <Progress value={item.riskScore} indicatorClassName={getRiskColor(item.riskScore)} />
                    <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
                      <span className='font-bold text-foreground'>{t('recommendation')}: </span>
                      {item.preventiveAction}
                    </p>
                  </div>
                </div>
              )) : (
                <p className='text-center text-muted-foreground pt-8'>{t('noSignificantRisks')}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const ForecastLoadingSkeleton = () => (
    <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="w-full space-y-3">
                    <div className='flex justify-between'>
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-1/2" />
                </div>
            </div>
        ))}
    </div>
)
