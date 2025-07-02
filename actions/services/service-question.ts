import { createClient } from "@/utils/supabase/server";

export async function ServiceQuestion() {
  const supabase = await createClient();

  // Step 1: Get the selected service ID
  const { data: selectedService, error: serviceError } = await supabase
    .from("services")
    .select("id")
    .single();

  if (serviceError || !selectedService?.id) {
    return {
      status: "error",
      message: `Failed to get service: ${serviceError?.message}`,
      code: "SERVICE_ERROR",
    };
  }

  const serviceId = selectedService.id;

  // Step 2: Get related service questions from service_request_forms
  const { data: serviceQuestions, error: questionError } = await supabase
    .from("service_request_forms")
    .select("*")
    .eq("service_id", serviceId); // assuming service_request_forms has a service_id column

  if (questionError) {
    return {
      status: "error",
      message: `Failed to get service questions: ${questionError.message}`,
      code: "FORM_ERROR",
    };
  }

  return {
    status: "success",
    serviceId,
    questions: serviceQuestions,
  };
}
