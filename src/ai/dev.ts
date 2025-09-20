'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/diagnose-plant-disease.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/farmer-chat.ts';
import '@/ai/flows/get-pest-disease-forecast.ts';
