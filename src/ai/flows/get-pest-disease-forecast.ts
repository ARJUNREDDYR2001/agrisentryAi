'use server';
/**
 * @fileOverview Predicts pest and disease outbreaks based on weather and crop type.
 * 
 * - getPestAndDiseaseForecast - A function that takes weather data and a crop type and returns a forecast.
 * - PestAndDiseaseForecast - The return type for the getPestAndDiseaseForecast function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PestAndDiseaseForecastInputSchema = z.object({
  temperature: z.number().describe('Current temperature in Celsius.'),
  humidity: z.number().describe('Current humidity percentage.'),
  rainForecast: z.string().describe('Rain forecast (e.g., \'No rain\', \'Light rain in 3 hours\').'),
  crop: z.string().describe('The type of crop being cultivated (e.g., "Tomato", "Rice", "Cotton").'),
});

const PestAndDiseaseForecastSchema = z.object({
  forecasts: z.array(z.object({
    type: z.enum(['disease', 'pest']).describe('The type of threat.'),
    name: z.string().describe('The common name of the potential disease or pest (e.g., "Downy Mildew", "Aphids").'),
    riskScore: z.number().min(0).max(100).describe('The predicted risk of an outbreak (0-100).'),
    timeline: z.string().describe('The likely timeframe for the outbreak (e.g., "Next 3-5 days", "Within a week").'),
    preventiveAction: z.string().max(150).describe('A concise, actionable preventive measure a farmer can take.'),
  })).describe('An array of up to 3 most likely pest and disease forecasts.'),
});

export type PestAndDiseaseForecast = z.infer<typeof PestAndDiseaseForecastSchema>;

export async function getPestAndDiseaseForecast(input: z.infer<typeof PestAndDiseaseForecastInputSchema>): Promise<PestAndDiseaseForecast> {
  return pestAndDiseaseForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pestAndDiseaseForecastPrompt',
  input: { schema: PestAndDiseaseForecastInputSchema },
  output: { schema: PestAndDiseaseForecastSchema },
  prompt: `You are AgriSentry AI, a specialist in agricultural epidemiology and predictive modeling for Indian farming conditions.

Your task is to predict the top 3 most likely pest and disease outbreaks for a given crop based on the provided weather conditions.

▼▼▼ CONTEXT ▼▼▼
- CROP: {{{crop}}}
- CURRENT WEATHER: {{{temperature}}}°C, {{{humidity}}}% humidity, Forecast: {{{rainForecast}}}
- REGION: Assume farming conditions in India.

▼▼▼ RULES ▼▼▼
1.  Analyze the weather context. High humidity and rain favor fungal/bacterial diseases. Temperature affects insect life cycles.
2.  Identify up to 3 specific diseases or pests that are most likely to become a problem under these conditions for the specified crop.
3.  For each potential threat, create a forecast object:
    - type: 'disease' or 'pest'.
    - name: The common name (e.g., "Powdery Mildew", "Thrips", "Bollworm").
    - riskScore: An integer from 0-100 representing the outbreak probability. Be realistic. Not everything is a high risk. A 30 is a low-medium risk, a 75 is a high risk.
    - timeline: A short, simple timeframe (e.g., "Within 5-7 days", "High risk after next rain").
    - preventiveAction: Provide a single, clear, and actionable preventive step. Max 150 characters. Example: "Consider applying neem oil spray after sunset to deter sucking pests." or "Ensure good air circulation by pruning lower leaves to reduce fungal risk."
4.  Return the response in EXACTLY the specified JSON format. Do not add any other text or explanation.`,
});

const pestAndDiseaseForecastFlow = ai.defineFlow(
  {
    name: 'pestAndDiseaseForecastFlow',
    inputSchema: PestAndDiseaseForecastInputSchema,
    outputSchema: PestAndDiseaseForecastSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
