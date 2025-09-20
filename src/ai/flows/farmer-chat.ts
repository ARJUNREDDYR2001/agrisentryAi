'use server';
/**
 * @fileOverview A multi-lingual chatbot for farmers.
 * - farmerChat - A function that handles the chatbot conversation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FarmerChatInputSchema = z.object({
    question: z.string().describe('The farmer\'s question.'),
    language: z.string().describe('The language for the response (e.g., "English", "Hindi", "Tamil").'),
    history: z.array(z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
    })).describe('The conversation history.'),
});

const FarmerChatOutputSchema = z.object({
    response: z.string().describe('The AI\'s response to the farmer.'),
});

export async function farmerChat(input: z.infer<typeof FarmerChatInputSchema>): Promise<z.infer<typeof FarmerChatOutputSchema>> {
    const { question, language, history } = input;

    const systemPrompt = `You are AgriSentryAI Assistant, an expert in Indian agriculture, crop diseases, and climate-smart farming. Your goal is to help Indian farmers with their questions.

    - Respond ONLY in the user's specified language: ${language}.
    - Keep your answers concise, clear, and easy to understand for a non-technical audience.
    - If you don't know the answer, say so. Do not make up information.
    - Be friendly and encouraging.`;

    const { output } = await ai.generate({
        prompt: question,
        history,
        system: systemPrompt,
    });
    
    return { response: output!.text! };
}
