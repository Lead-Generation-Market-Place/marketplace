"use server";

import { createClient } from "@/utils/supabase/server";

// Capitalize each word
const capitalizeWords = (str: string): string =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

/**
 * Fetch all categories
 */
export const GetAllCategories = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("id, name");

  if (error) {
    console.error("Category fetch error:", error.message);
    return [];
  }
  return data.map((item) => ({ id: item.id, name: capitalizeWords(item.name) }));
};

/**
 * Fetch subcategories for a given category
 */
export const GetSubcategoriesByCategory = async (categoryId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sub_categories")
    .select("id, name")
    .eq("category_id", categoryId);

  if (error) {
    return [];
  }
  return data.map((item) => ({ id: item.id, name: capitalizeWords(item.name) }));
};

/**
 * Fetch services for a given subcategory
 */
export const GetServicesBySubcategory = async (subcategoryId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, name")
    .eq("subcategory_id", subcategoryId);

  if (error) {
    console.error("Service fetch error:", error.message);
    return [];
  }
  return data.map((item) => ({ id: item.id, name: capitalizeWords(item.name) }));
};

/**
 * Get hierarchical structure: category > subcategory > services
 */
export const GetAllServicesWithHierarchy = async () => {
  const supabase = await createClient();
  const { data: categories, error: catError } = await supabase.from("categories").select("id, name");
  if (catError) {
    console.error("Category fetch error:", catError.message);
    return {};
  }

  const hierarchy: Record<string, Record<string, string[]>> = {};

  for (const category of categories) {
    const { data: subcategories, error: subError } = await supabase
      .from("sub_categories")
      .select("id, name")
      .eq("category_id", category.id);
    if (subError) continue;

    const subHierarchy: Record<string, string[]> = {};

    for (const subcategory of subcategories) {
      const { data: services, error: srvError } = await supabase
        .from("services")
        .select("name")
        .eq("sub_categories_id", subcategory.id);
      if (srvError) continue;

      subHierarchy[capitalizeWords(subcategory.name)] = services.map((srv) => capitalizeWords(srv.name));
    }

    hierarchy[capitalizeWords(category.name)] = subHierarchy;
  }

  return hierarchy;
};

/**
 * Get all unique location names
 */
export const GetAllLocations = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("us_location").select("state");
  if (error) {
    console.error("Location fetch error:", error.message);
    return [];
  }
  const states = [...new Set(data.map((item) => capitalizeWords(item.state)))];
  return states;
};

/**
 * Handles filtered search for services based on selected services and location
 */
export const ProfessionalServices = async (formData: FormData) => {
  const selectedServices = formData.getAll("services").map((s) => s.toString().trim().toLowerCase());
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
