'use client';

import { useEffect, useRef, useState } from 'react';
import type { DiagnosisResult } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AgroDealerModal from './agro-dealer-modal';
import { AlertCircle, CheckCircle, RefreshCw, Volume2, MapPin } from 'lucide-react';
import { useLocale } from '@/context/locale-context';

type DiagnosisResultProps = {
  result: DiagnosisResult;
  onReset: () => void;
};

export default function DiagnosisResultComponent({ result, onReset }: DiagnosisResultProps) {
  const { t } = useLocale();
  const confidenceColor = result.confidence > 70 ? 'bg-primary' : result.confidence > 40 ? 'bg-yellow-500' : 'bg-destructive';
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // When a new result comes in, ensure the audio element is aware of the new source
    if (result.audio && audioRef.current) {
        audioRef.current.src = result.audio;
        // The `autoPlay` attribute will handle the initial playback.
        // We add a `.catch` to handle browsers that block autoplay.
        audioRef.current.play().catch(error => {
            console.warn("Autoplay was prevented by the browser.", error);
        });
    }
  }, [result.audio]);

  const playAudio = () => {
    // The user can always click to play.
    audioRef.current?.play().catch(e => console.error("Audio playback failed on click:", e));
  }

  const hasDealers = result.dealers && result.dealers.length > 0;

  return (
    <>
      <div className="space-y-6">
        <Card className="bg-background/50 border-primary/50">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline text-2xl text-primary">{result.disease}</CardTitle>
                <CardDescription>{t('aiDiagnosisResult')}</CardDescription>
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
                <span className="text-sm font-medium text-muted-foreground">{t('confidence')}</span>
                <span className="text-sm font-bold">{result.confidence}%</span>
              </div>
              <Progress value={result.confidence} indicatorClassName={confidenceColor} />
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('climateSmartAdvice')}</h4>
              <p className="text-lg font-semibold p-3 bg-accent/10 rounded-md border border-accent/20">
                "{result.advice}"
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('microInsurance')}</h4>
              {result.insurance_eligible ? (
                <Badge variant="default" className="bg-accent text-accent-foreground">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {t('eligibleForClaim')}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {t('notEligible')}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-2 pt-6 border-t">
          {hasDealers && (
              <Button variant="outline" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setIsModalOpen(true)}>
                <MapPin className="mr-2 h-4 w-4" /> {t('findNearestAgroDealers')}
              </Button>
          )}
          <Button variant="outline" onClick={onReset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('diagnoseAnotherPlant')}
          </Button>
        </div>
        {/* The autoPlay attribute is key for the initial playback. `controls` can be added for debugging. */}
        {result.audio && <audio ref={audioRef} src={result.audio} autoPlay className="hidden" />}
      </div>
      {hasDealers && (
        <AgroDealerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          dealers={result.dealers}
          remedy={result.remedy_category}
        />
      )}
    </>
  );
}
