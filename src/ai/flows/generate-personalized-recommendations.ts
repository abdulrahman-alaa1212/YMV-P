'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized AR/MR technology recommendations
 * based on a hospital's needs and profile.
 *
 * - generatePersonalizedRecommendations - A function that takes hospital data and returns personalized AR/MR recommendations.
 * - HospitalProfileInput - The input type for the generatePersonalizedRecommendations function.
 * - RecommendationOutput - The return type for the generatePersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the hospital profile
const HospitalProfileInputSchema = z.object({
  hospitalName: z.string().describe('The name of the hospital.'),
  hospitalSize: z.string().describe('The size of the hospital (e.g., small, medium, large).'),
  specialties: z.string().describe('The medical specialties offered by the hospital (e.g., cardiology, oncology).'),
  arMrExperience: z.string().describe('The hospital’s prior experience with AR/MR technologies (e.g., none, some, extensive).'),
  needsAssessment: z.string().describe('A detailed assessment of the hospital’s needs and challenges that AR/MR technologies could address.'),
});
export type HospitalProfileInput = z.infer<typeof HospitalProfileInputSchema>;

// Define the output schema for the recommendations
const RecommendationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the personalized AR/MR technology recommendations.'),
  recommendations: z.array(z.string()).describe('An array of specific AR/MR technology recommendations tailored to the hospital profile.'),
  roadmap: z.string().describe('A roadmap for implementing the recommended AR/MR technologies.'),
});
export type RecommendationOutput = z.infer<typeof RecommendationOutputSchema>;

// Exported function to generate personalized recommendations
export async function generatePersonalizedRecommendations(
  input: HospitalProfileInput
): Promise<RecommendationOutput> {
  return personalizedRecommendationsFlow(input);
}

// Define the prompt for generating personalized recommendations
const personalizedRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: HospitalProfileInputSchema},
  output: {schema: RecommendationOutputSchema},
  prompt: `You are an expert in AR/MR technologies for hospitals. Based on the
  hospital's profile and needs assessment, provide personalized AR/MR technology
  recommendations.

Hospital Name: {{hospitalName}}
Hospital Size: {{hospitalSize}}
Specialties: {{specialties}}
AR/MR Experience: {{arMrExperience}}
Needs Assessment: {{needsAssessment}}

Provide a summary of your recommendations, a list of specific AR/MR technology
recommendations, and a roadmap for implementing the recommended technologies.`,
});

// Define the Genkit flow for generating personalized recommendations
const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: HospitalProfileInputSchema,
    outputSchema: RecommendationOutputSchema,
  },
  async input => {
    const {output} = await personalizedRecommendationsPrompt(input);
    return output!;
  }
);
