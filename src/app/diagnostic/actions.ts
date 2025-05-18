"use server";

import { generatePersonalizedRecommendations, HospitalProfileInput, RecommendationOutput } from '@/ai/flows/generate-personalized-recommendations';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client

export async function getPersonalizedRecommendationsAction(
  data: HospitalProfileInput
): Promise<{ success: true; data: RecommendationOutput } | { success: false; error: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in to get recommendations." };
    }

    // Potentially add more validation here if needed, though Zod in the flow should handle it.
    const result = await generatePersonalizedRecommendations(data);

    // Save diagnostic input to database
    const { data: diagnosticData, error: diagnosticError } = await supabase
      .from('diagnostics')
      .insert({
        user_id: user.id,
        hospital_name: data.hospitalName,
        hospital_size: data.hospitalSize,
        specialties: data.specialties,
        ar_mr_experience: data.arMrExperience,
        needs_assessment: data.needsAssessment,
      })
      .select()
      .single();

    if (diagnosticError) {
      console.error("Error saving diagnostic data:", diagnosticError);
      return { success: false, error: "Failed to save diagnostic data." };
    }

    // Save recommendations to database
    const { error: recommendationsError } = await supabase
      .from('recommendations')
      .insert({
        diagnostic_id: diagnosticData.id,
        summary: result.summary,
        recommendations: result.recommendations, // Store as JSONB
        roadmap: result.roadmap,
      });

    if (recommendationsError) {
      console.error("Error saving recommendations:", recommendationsError);
      // Consider deleting the diagnostic entry if saving recommendations fails
      await supabase.from('diagnostics').delete().eq('id', diagnosticData.id);
      return { success: false, error: "Failed to save recommendations." };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Error generating or saving recommendations:", error);
    // It's good to check the error type and provide a more specific message if possible
    if (error instanceof Error) {
      return { success: false, error: `An error occurred: ${error.message}` };
    }
    return { success: false, error: "An unknown error occurred." };
  }
}
