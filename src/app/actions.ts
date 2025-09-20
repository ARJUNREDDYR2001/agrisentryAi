'use server';

import { diagnosePlantDisease, type DiagnosePlantDiseaseOutput } from '@/ai/flows/diagnose-plant-disease';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { z } from 'zod';

const diagnosisSchema = z.object({
  photo: z.instanceof(File).refine(file => file.size > 0, 'Image is required.'),
  temperature: z.coerce.number(),
  humidity: z.coerce.number(),
  rainForecast: z.string(),
});

export type DiagnosisResult = DiagnosePlantDiseaseOutput & { audio?: string };

export async function runDiagnosis(formData: FormData): Promise<{data: DiagnosisResult | null; error: string | null;}> {
  const parsed = diagnosisSchema.safeParse({
    photo: formData.get('photo'),
    temperature: formData.get('temperature'),
    humidity: formData.get('humidity'),
    rainForecast: formData.get('rainForecast'),
  });

  if (!parsed.success) {
    return { data: null, error: parsed.error.issues[0].message };
  }
  
  const { photo, temperature, humidity, rainForecast } = parsed.data;

  try {
    const buffer = await photo.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const photoDataUri = `data:${photo.type};base64,${base64}`;

    const diagnosisResult = await diagnosePlantDisease({
      photoDataUri,
      temperature,
      humidity,
      rainForecast,
    });

    const audioText = `Diagnosis: ${diagnosisResult.disease}. Advice: ${diagnosisResult.advice}. Insurance eligibility: ${diagnosisResult.insurance_eligible ? 'Eligible' : 'Not Eligible'}.`;

    const audioResult = await textToSpeech(audioText);
    
    return { data: { ...diagnosisResult, audio: audioResult.media }, error: null };

  } catch (e) {
    console.error(e);
    return { data: null, error: 'An unexpected error occurred during diagnosis. Please try again later.' };
  }
}
