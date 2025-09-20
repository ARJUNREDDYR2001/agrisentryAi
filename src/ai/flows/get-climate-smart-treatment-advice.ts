'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing climate-smart treatment advice to farmers based on plant disease diagnosis and local weather conditions.
 *
 * - getClimateSmartTreatmentAdvice - A function that takes plant disease and weather information as input and returns tailored treatment advice.
 * - ClimateSmartTreatmentAdviceInput - The input type for the getClimateSmartTreatmentAdvice function.
 * - ClimateSmartTreatmentAdviceOutput - The return type for the getClimateSmartTreatmentAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClimateSmartTreatmentAdviceInputSchema = z.object({
  disease: z.string().describe('The name of the diagnosed plant disease.'),
  temperature: z.number().describe('The current temperature in Celsius.'),
  humidity: z.number().describe('The current humidity percentage.'),
  rainForecast: z.string().describe('A short description of the rain forecast (e.g., \'No rain\', \'Light rain in 3 hours\', \'Heavy rain expected\').'),
  cropType: z.string().describe('The type of crop affected (e.g., rice, tomato, chilli, cotton).'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ClimateSmartTreatmentAdviceInput = z.infer<typeof ClimateSmartTreatmentAdviceInputSchema>;

const ClimateSmartTreatmentAdviceOutputSchema = z.object({
  disease: z.string().describe('The name of the diagnosed disease.'),
  confidence: z.number().describe('Confidence level (0-100) in the diagnosis.'),
  advice: z.string().describe('Actionable treatment advice (max 15 words).'),
  insuranceEligible: z.boolean().describe('Whether the disease qualifies for micro-insurance.'),
});
export type ClimateSmartTreatmentAdviceOutput = z.infer<typeof ClimateSmartTreatmentAdviceOutputSchema>;

export async function getClimateSmartTreatmentAdvice(
  input: ClimateSmartTreatmentAdviceInput
): Promise<ClimateSmartTreatmentAdviceOutput> {
  return climateSmartTreatmentAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'climateSmartTreatmentAdvicePrompt',
  input: {schema: ClimateSmartTreatmentAdviceInputSchema},
  output: {schema: ClimateSmartTreatmentAdviceOutputSchema},
  prompt: `You are AgriSentry AI, a climate-smart farming assistant for Indian smallholder farmers. Analyze the plant image (if present) and weather context below, then return your response in EXACTLY this JSON format — and nothing else:\n\n{\n  "disease": "DISEASE_NAME",
  "confidence": XX,
  "advice": "ACTIONABLE_SENTENCE_MAX_15_WORDS",
  "insurance_eligible": true/false
}\n\n▼▼▼ CONTEXT ▼▼▼\n- LOCATION: India (assume tropical/subtropical conditions)\n- CURRENT WEATHER: {{temperature}}°C, {{humidity}}%, {{rainForecast}}\n- CROP TYPE: {{cropType}}\n{{#if photoDataUri}}- PLANT PHOTO: {{media url=photoDataUri}}{{/if}}\n\n▼▼▼ RULES ▼▼▼\n1. Disease: Use precise scientific/common name. If unsure → \"Unknown Disease\".
2. Confidence: 0-100 integer. 50 if uncertain.
3. Advice: Direct, simple English. Max 15 words. Example: “Wait 6 hrs — rain coming.”
4. insurance_eligible: true if disease is fungal, bacterial, or moisture/heat-triggered. false if mechanical/nutrient/viral (non-climate).
5. NEVER add explanations, notes, or formatting outside the JSON.`,
});

const climateSmartTreatmentAdviceFlow = ai.defineFlow(
  {
    name: 'climateSmartTreatmentAdviceFlow',
    inputSchema: ClimateSmartTreatmentAdviceInputSchema,
    outputSchema: ClimateSmartTreatmentAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
