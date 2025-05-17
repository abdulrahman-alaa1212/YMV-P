"use server";

import { generatePersonalizedRecommendations, HospitalProfileInput, RecommendationOutput } from '@/ai/flows/generate-personalized-recommendations';

export async function getPersonalizedRecommendationsAction(
  data: HospitalProfileInput
): Promise<{ success: true; data: RecommendationOutput } | { success: false; error: string }> {
  try {
    // Potentially add more validation here if needed, though Zod in the flow should handle it.
    const result = await generatePersonalizedRecommendations(data);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error generating recommendations:", error);
    // It's good to check the error type and provide a more specific message if possible
    if (error instanceof Error) {
      return { success: false, error: `Failed to generate recommendations: ${error.message}` };
    }
    return { success: false, error: "An unknown error occurred while generating recommendations." };
  }
}
