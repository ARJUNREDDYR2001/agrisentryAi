'use client';

import { useEffect, useRef } from 'react';
import type { DiagnosisResult } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AgroDealerModal from './agro-dealer-modal';
import { AlertCircle, CheckCircle, RefreshCw, Volume2 } from 'lucide-react';

type DiagnosisResultProps = {
  result: DiagnosisResult;
  onReset: () => void;
};

export default function DiagnosisResultComponent({ result, onReset }: DiagnosisResultProps) {
  const confidenceColor = result.confidence > 70 ? 'bg-primary' : result.confidence > 40 ? 'bg-yellow-500' : 'bg-destructive';
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (result.audio && audioRef.current) {
      audioRef.current.src = result.audio;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio playback failed:", error);
        });
      }
    }
  }, [result]);

  const playAudio = () => {
    audioRef.current?.play().catch(e => console.error("Audio playback failed:", e));
  }

  return (
    <div className="space-y-6">
      <Card className="bg-background/50 border-primary/50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-2xl text-primary">{result.disease}</CardTitle>
              <CardDescription>AI Diagnosis Result</CardDescription>
            </div>
            {result.audio && (
              <Button variant="ghost" size="icon" onClick={playAudio} aria-label="Play diagnosis audio">
                <Volume2 className="h-6 w-6 text-primary" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-muted-foreground">Confidence</span>
              <span className="text-sm font-bold">{result.confidence}%</span>
            </div>
            <Progress value={result.confidence} indicatorClassName={confidenceColor} />
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Climate-Smart Advice</h4>
            <p className="text-lg font-semibold p-3 bg-accent/10 rounded-md border border-accent/20">
              "{result.advice}"
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Micro-Insurance</h4>
            {result.insurance_eligible ? (
              <Badge variant="default" className="bg-accent text-accent-foreground">
                <CheckCircle className="mr-2 h-4 w-4" />
                Eligible for Claim
              </Badge>
            ) : (
              <Badge variant="secondary">
                <AlertCircle className="mr-2 h-4 w-4" />
                Not Eligible
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-2 pt-6 border-t">
        <AgroDealerModal />
        <Button variant="outline" onClick={onReset} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Diagnose Another Plant
        </Button>
      </div>
      {result.audio && <audio ref={audioRef} className="hidden" />}
    </div>
  );
}
