'use server';
/**
 * @fileOverview Diagnoses plant diseases from an image and provides treatment advice.
 *
 * - diagnosePlantDisease - A function that takes a plant image and weather data, then diagnoses the plant disease.
 * - DiagnosePlantDiseaseInput - The input type for the diagnosePlantDisease function.
 * - DiagnosePlantDiseaseOutput - The return type for the diagnosePlantDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePlantDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a diseased plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  temperature: z.number().describe('Current temperature in Celsius.'),
  humidity: z.number().describe('Current humidity percentage.'),
  rainForecast: z.string().describe('Rain forecast (e.g., \'No rain\', \'Light rain in 3 hours\').'),
});
export type DiagnosePlantDiseaseInput = z.infer<typeof DiagnosePlantDiseaseInputSchema>;

const DiagnosePlantDiseaseOutputSchema = z.object({
  disease: z.string().describe('The name of the disease.'),
  confidence: z.number().describe('The confidence level of the diagnosis (0-100).'),
  advice: z.string().describe('Actionable treatment advice (max 15 words).'),
  insurance_eligible: z.boolean().describe('Whether the disease is climate-linked and eligible for insurance.'),
});
export type DiagnosePlantDiseaseOutput = z.infer<typeof DiagnosePlantDiseaseOutputSchema>;

export async function diagnosePlantDisease(input: DiagnosePlantDiseaseInput): Promise<DiagnosePlantDiseaseOutput> {
  return diagnosePlantDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantDiseasePrompt',
  input: {schema: DiagnosePlantDiseaseInputSchema},
  output: {schema: DiagnosePlantDiseaseOutputSchema},
  prompt: `You are AgriSentry AI, a climate-smart farming assistant for Indian smallholder farmers. Analyze the plant image and weather context below, then return your response in EXACTLY this JSON format — and nothing else:

{
  "disease": "DISEASE_NAME",
  "confidence": XX,
  "advice": "ACTIONABLE_SENTENCE_MAX_15_WORDS",
  "insurance_eligible": true/false
}

▼▼▼ CONTEXT ▼▼▼
- LOCATION: India (assume tropical/subtropical conditions)
- CURRENT WEATHER: {{{temperature}}}°C, {{{humidity}}}%, {{{rainForecast}}}
- CROP TYPE: Assume common Indian crop (rice, tomato, chilli, cotton, etc.) unless visible

▼▼▼ RULES ▼▼▼
1. Disease: Use precise scientific/common name. If unsure → \"Unknown Disease\".
2. Confidence: 0-100 integer. 50 if uncertain.
3. Advice: Direct, simple English. Max 15 words. Example: “Wait 6 hrs — rain coming.”
4. insurance_eligible: true if disease is fungal, bacterial, or moisture/heat-triggered. false if mechanical/nutrient/viral (non-climate).
5. NEVER add explanations, notes, or formatting outside the JSON.

Here is the image of the plant:
{{media url=photoDataUri}}`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const diagnosePlantDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnosePlantDiseaseFlow',
    inputSchema: DiagnosePlantDiseaseInputSchema,
    outputSchema: DiagnosePlantDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
