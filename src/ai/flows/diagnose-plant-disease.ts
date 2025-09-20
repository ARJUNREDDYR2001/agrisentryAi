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

// Mock database of agro-dealers and their product categories
const dealers = [
  { id: 1, name: 'Kisan Kendra', address: '123, Market Road, Pune', phone: '9876543210', products: ['fungicide', 'bio-pesticide', 'fertilizer'] },
  { id: 2, name: 'Farm Essentials', address: '45, Agri Chowk, Nashik', phone: '9876543211', products: ['pesticide', 'fungicide', 'nematicide'] },
  { id: 3, name: 'Green Growth Agro', address: '78, Village Main St, Baramati', phone: '9876543212', products: ['bio-pesticide', 'organic_fertilizer', 'fungicide'] },
  { id: 4, name: 'Crop Care India', address: '99, Highway Junction, Satara', phone: '9876543213', products: ['pesticide', 'fertilizer', 'growth_promoter'] },
];

const getDealerInfo = ai.defineTool(
  {
    name: 'getDealerInfo',
    description: 'Get a list of agro-dealers who stock a specific category of product.',
    inputSchema: z.object({
      productCategory: z.string().describe('The category of product to search for, e.g., "fungicide", "pesticide", "bio-pesticide".'),
    }),
    outputSchema: z.array(z.object({
        name: z.string(),
        address: z.string(),
        phone: z.string(),
    })),
  },
  async (input) => {
    return dealers.filter(d => d.products.includes(input.productCategory));
  }
);


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
  remedy_category: z.string().describe('The general category of the recommended treatment product, e.g., "fungicide", "pesticide", "bio-pesticide", "nematicide", or "none".'),
  insurance_eligible: z.boolean().describe('Whether the disease is climate-linked and eligible for insurance.'),
  dealers: z.array(z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string(),
  })).describe('A list of dealers who can supply the necessary remedy.'),
});
export type DiagnosePlantDiseaseOutput = z.infer<typeof DiagnosePlantDiseaseOutputSchema>;

export async function diagnosePlantDisease(input: DiagnosePlantDiseaseInput): Promise<DiagnosePlantDiseaseOutput> {
  return diagnosePlantDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantDiseasePrompt',
  input: {schema: DiagnosePlantDiseaseInputSchema},
  output: {schema: DiagnosePlantDiseaseOutputSchema},
  tools: [getDealerInfo],
  prompt: `You are AgriSentry AI, a climate-smart farming assistant for Indian smallholder farmers. Analyze the plant image and weather context.

Your primary goal is to:
1. Identify the disease.
2. Provide simple, actionable advice.
3. Determine if the disease is climate-related for insurance purposes.
4. Classify the required treatment into a single category: 'fungicide', 'pesticide', 'bio-pesticide', 'nematicide', or 'none'.
5. Use the getDealerInfo tool to find dealers who stock the required remedy category.

Return your response in EXACTLY the specified JSON format.

▼▼▼ CONTEXT ▼▼▼
- LOCATION: India (assume tropical/subtropical conditions)
- CURRENT WEATHER: {{{temperature}}}°C, {{{humidity}}}%, {{{rainForecast}}}
- CROP TYPE: Assume common Indian crop (rice, tomato, chilli, cotton, etc.) unless visible

▼▼▼ RULES ▼▼▼
1. disease: Use precise scientific/common name. If unsure → "Unknown Disease".
2. confidence: 0-100 integer. 50 if uncertain.
3. advice: Direct, simple English. Max 15 words. Example: “Apply neem oil spray after sunset.”
4. remedy_category: Based on your advice, classify the treatment. E.g., if advice is "Apply neem oil", the category is "bio-pesticide". If it's a sulfur-based treatment, it's "fungicide". If no product is needed, use "none".
5. insurance_eligible: true if disease is fungal, bacterial, or moisture/heat-triggered. false if mechanical/nutrient/viral (non-climate).
6. dealers: Call the getDealerInfo tool with the remedy_category you identified. If the category is 'none', pass an empty array.
7. NEVER add explanations, notes, or formatting outside the JSON.

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
