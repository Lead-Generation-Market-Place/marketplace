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

/**
 * Returns service name suggestions (max 10)
 */
export const SearchServiceSuggestions = async (query: string): Promise<string[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("name")
    .ilike("name", `%${query}%`)
    .limit(10);

  if (error) {
    console.error("Service suggestion error:", error.message);
    return [];
  }

  return Array.from(new Set(data.map((item) => capitalizeWords(item.name)))).slice(0, 10);
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
