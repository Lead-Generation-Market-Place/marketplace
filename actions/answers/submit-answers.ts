"use server";

import { createClient } from "@/utils/supabase/server";

export interface AnswerPayload {
  form_id: number;
  service_id: number;
  answer: string | string[]; // could be a single string or array
}

export async function SubmitAnswers(payload: AnswerPayload[]) {
  const supabase = await createClient();

  // Step 1: Get authenticated user
  const {
    data: authData,
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !authData?.user) {
    return {
      success: false,
      error: "User not authenticated or failed to fetch user.",
    };
  }

  const userId = authData.user.id;

  // Step 2: Get provider_id
  const {
    data: professional,
    error: professionalError,
  } = await supabase
    .from("service_providers")
    .select("provider_id")
    .eq("user_id", userId)
    .single();

  if (professionalError || !professional?.provider_id) {
    return {
      success: false,
      error: "Failed to fetch provider_id for the authenticated user.",
    };
  }

  const provider_id = professional.provider_id;

  // Step 3: Check for duplicates
  const duplicateChecks = await Promise.all(
    payload.map(async (entry) => {
      const { data, error } = await supabase
        .from("service_answers")
        .select("id")
        .eq("form_id", entry.form_id)
        .eq("service_id", entry.service_id)
        .eq("provider_id", provider_id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data !== null; // true if exists
    })
  );

  const duplicates = duplicateChecks.some((exists) => exists);

  if (duplicates) {
    return {
      success: false,
      error: "You have already submitted answers for this service.",
    };
  }

  // Step 4: Insert answers
  try {
    const { error } = await supabase.from("service_answers").insert(
      payload.map((entry) => ({
        form_id: entry.form_id,
        service_id: entry.service_id,
        provider_id,
        answer: Array.isArray(entry.answer)
          ? JSON.stringify(entry.answer)
          : entry.answer,
      }))
    );

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Submission error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : JSON.stringify(error),
    };
  }
}
