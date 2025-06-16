"use server";

import { createClient } from "@/utils/supabase/server";

// Utility to capitalize each word
const capitalizeWords = (str: string): string =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

// Fetch all categories
export const getAllCategories = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("id, name");

  if (error) {
    console.error("Category fetch error:", error.message);
    return [];
  }

  return data.map(({ id, name }) => ({
    id,
    name: capitalizeWords(name),
  }));
};

// Fetch subcategories by category ID
export const getSubcategoriesByCategory = async (categoryId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sub_categories")
    .select("id, name")
    .eq("category_id", categoryId);

  if (error) return [];

  return data.map(({ id, name }) => ({
    id,
    name: capitalizeWords(name),
  }));
};

// Fetch services by subcategory ID
export const getServicesBySubcategory = async (subcategoryId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, name")
    .eq("subcategory_id", subcategoryId);

  if (error) {
    console.error("Service fetch error:", error.message);
    return [];
  }

  return data.map(({ id, name }) => ({
    id,
    name: capitalizeWords(name),
  }));
};

// Get full hierarchy: category > subcategories > services
export const getAllServicesWithHierarchy = async () => {
  const supabase = await createClient();
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, name");

  if (catError) {
    console.error("Category fetch error:", catError.message);
    return {};
  }

  const hierarchy: Record<string, Record<string, string[]>> = {};

  for (const category of categories) {
    const { data: subcategories } = await supabase
      .from("sub_categories")
      .select("id, name")
      .eq("category_id", category.id);

    if (!subcategories) continue;

    const subHierarchy: Record<string, string[]> = {};

    for (const subcategory of subcategories) {
      const { data: services } = await supabase
        .from("services")
        .select("name")
        .eq("sub_categories_id", subcategory.id);

      if (!services) continue;

      subHierarchy[capitalizeWords(subcategory.name)] = services.map((srv) =>
        capitalizeWords(srv.name)
      );
    }

    hierarchy[capitalizeWords(category.name)] = subHierarchy;
  }

  return hierarchy;
};

// Get all unique state names from locations
export const getAllLocations = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("us_location").select("state");

  if (error) {
    console.error("Location fetch error:", error.message);
    return [];
  }

  const states = [...new Set(data.map((item) => capitalizeWords(item.state)))];
  return states;
};

// Filter professionals by selected services and location
export const professionalServices = async (formData: FormData) => {
  const selectedServices = formData
    .getAll("services")
    .map((s) => s.toString().trim().toLowerCase());

  const selectedState = formData.get("location")?.toString().trim().toLowerCase() || "";

  if (!selectedServices.length && !selectedState) {
    return {
      status: "error",
      message: "Please select at least one filter: service or state.",
    };
  }

  const supabase = await createClient();
  let query = supabase.from("services").select("*").limit(50);

  if (selectedServices.length) {
    query = query.in("name", selectedServices);
  }

  if (selectedState) {
    const { data: locationData, error: locationError } = await supabase
      .from("us_location")
      .select("state")
      .ilike("state", `%${selectedState}%`)
      .limit(10);

    if (locationError || !locationData?.length) {
      return {
        status: "error",
        message: "No matching states found.",
      };
    }
  }

  const { data, error } = await query;

  if (error || !data?.length) {
    return {
      status: "error",
      message: "No matching services found.",
    };
  }

  const formattedData = data.map((item) => ({
    ...item,
    name: capitalizeWords(item.name),
    location: item.location ? capitalizeWords(item.location) : item.location,
  }));

  return {
    status: "success",
    data: formattedData,
  };
};

// Authenticated user info
export const getCurrentUser = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) return null;

  const { id, email, user_metadata } = data.user;
  return { id, email, user_metadata };
};

// Create a customer plan
export const createCustomerPlan = async (service_id: string, plan_type: string) => {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Could not get current user" };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("plan")
    .insert([{ user_id: user.id, service_id, plan_type }]);

  return error
    ? { success: false, error: error.message }
    : { success: true, data };
};

// Get a user's plans
export const getCustomerPlans = async () => {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Could not get current user" };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("plan")
    .select("id, plan_type, user_id, service:service_id(id, name)")
    .eq("user_id", user.id)
    .order("id", { ascending: true });

  return error
    ? { success: false, error: error.message }
    : { success: true, data };
};

// Remove a user's plan
export const removePlan = async (planId: string) => {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return { error: new Error("User not authenticated") };

  const { error } = await supabase
    .from("plan")
    .delete()
    .eq("user_id", user.id)
    .eq("id", planId);

  return { error };
};

// Autocomplete suggestions for services
export interface ServiceSuggestion {
  id: string;
  name: string;
  description: string;
}

export const searchServiceSuggestions = async (
  query: string
): Promise<ServiceSuggestion[]> => {
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
    name: capitalizeWords(item.name),
  }));
};

// Autocomplete suggestions for location (states)
export const searchLocationSuggestions = async (
  query: string
): Promise<string[]> => {
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

// Fetch all services for idea display
export const fetchServiceIdeas = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Service fetch error:", error.message);
    return [];
  }

  return data.map((item) => ({
    ...item,
    name: capitalizeWords(item.name),
  }));
};

