"use server";

import { createClient } from "@/utils/supabase/server";


// Capitalize each word
const capitalizeWords = (str: string): string =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

/**
 * Handles filtered search for services based on selected service and/or location (only state)
 */
export const ProfessionalServices = async (formData: FormData) => {
  const selectedService = formData.get("service")?.toString().trim().toLowerCase() || "";
  const selectedState = formData.get("location")?.toString().trim().toLowerCase() || "";

  if (!selectedService && !selectedState) {
    return {
      status: "error",
      message: "Please select at least one filter: service or state.",
    };
  }

  const supabase = await createClient();
  let query = supabase.from("services").select("*").limit(20);

  if (selectedService) {
    query = query.ilike("name", `%${selectedService}%`);
  }

  if (selectedState) {
    // Search only by state (no zip)
    const { data: locationData, error: locationError } = await supabase
      .from("us_location")
      .select("state")
      .ilike("state", `%${selectedState}%`)
      .limit(10);

    if (locationError) {
      console.error("Location search error:", locationError.message);
      return {
        status: "error",
        message: "Unable to search locations. Please try again.",
      };
    }

    if (!locationData?.length) {
      return {
        status: "error",
        message: "No matching states found.",
      };
    }

  }

  const { data, error } = await query;

  if (error) {
    console.error("Service search error:", error.message);
    return {
      status: "error",
      message: "Unable to search services. Please try again.",
    };
  }

  if (!data?.length) {
    return {
      status: "error",
      message: "No matching services found.",
    };
  }

  // Format output
  const formattedData = data.map((item) => ({
    ...item,
    name: item.name ? capitalizeWords(item.name) : item.name,
    location: item.location ? capitalizeWords(item.location) : item.location,
  }));

  return {
    status: "success",
    data: formattedData,
  };
};

// Get current user information
export const getCurrentUser = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return null;
  }
  // Return only a plain object for serialization safety (if used in server/client boundary)
  const { id, email, user_metadata } = data.user;
  return { id, email, user_metadata };
};


// Insert into Plan table the customer plans
export const createCustomerPlan = async (
  service_id: string,
  plan_type: string
) => {
  // Get the current user using the reusable utility
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Could not get current user" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("plan")
    .insert([{ user_id: user.id, service_id, plan_type }]);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data };
};


// get the current user plans
export const getCustomerPlans = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Could not get current user" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plan")
    .select("id, plan_type, user_id, service:service_id(id, name)") // <- fixed here
    .eq("user_id", user.id)
    .order("id", { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};

export async function removePlan(planId: string): Promise<{ error: Error | null }> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) {
    return { error: new Error('User not authenticated') };
  }
  const userId = user.id;
  const { error } = await supabase
    .from('plan')
    .delete()
    .eq('user_id', userId)
    .eq('id', planId);

  return { error };
}

/**
 * Returns service name suggestions (max 10)
 */
interface ServiceSuggestion {
  id: string;
  name: string;
  description: string;
}


export const SearchServiceSuggestions = async (query: string): Promise<ServiceSuggestion[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .ilike("name", `%${query}%`)
    .limit(10);

  if (error) {
    console.error("Service suggestion error:", error.message);
    return [];
  }
  return data.map((item) => ({
    ...item,
    name: capitalizeWords(item.name)
  }));

  // return Array.from(new Set(data.map((item) => capitalizeWords(item.name)))).slice(0, 10);
};

/**
 * Returns location suggestions (states only) based on query
 */
export const SearchLocationSuggestions = async (query: string): Promise<string[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("us_location")
    .select("state")
    .ilike("state", `%${query}%`)
    .limit(10);

  if (error) {
    console.error("Location suggestion error:", error.message);
    return [];
  }

  const suggestions = new Set<string>();

  data.forEach(({ state }) => {
    if (state && state.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(capitalizeWords(state));
    }
  });

  return Array.from(suggestions).slice(0, 10);
};

export const fetchServiceIdea = async () => {
  const supabase = await createClient();
  
  const {data, error} = await supabase
  .from("services")
  .select("*")
  .order("id", { ascending: true });
  if (error) {
    console.error("Service suggestion error:", error.message);
    return [];
  }
  return data.map((item) => ({
    ...item,
    name: capitalizeWords(item.name)
  }));
}
