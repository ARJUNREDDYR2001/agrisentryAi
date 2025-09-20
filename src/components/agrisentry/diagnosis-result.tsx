'use client';

import type { DiagnosePlantDiseaseOutput } from '@/ai/flows/diagnose-plant-disease';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AgroDealerModal from './agro-dealer-modal';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

type DiagnosisResultProps = {
  result: DiagnosePlantDiseaseOutput;
  onReset: () => void;
};

export default function DiagnosisResult({ result, onReset }: DiagnosisResultProps) {
  const confidenceColor = result.confidence > 70 ? 'bg-primary' : result.confidence > 40 ? 'bg-yellow-500' : 'bg-destructive';

  return (
    <div className="space-y-6">
      <Card className="bg-background/50 border-primary/50">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">{result.disease}</CardTitle>
          <CardDescription>AI Diagnosis Result</CardDescription>
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
    </div>
  );
}
