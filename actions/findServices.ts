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
 * Get hierarchical structure: category > subcategory > services (id and name)
 */
export const GetAllServicesWithHierarchy = async () => {
  const supabase = await createClient();
  const { data: categories, error: catError } = await supabase.from("categories").select("id, name");

  if (catError) {
    console.error("Category fetch error:", catError.message);
    return {};
  }

  const hierarchy: Record<string, Record<string, { id: number; name: string }[]>> = {};

  for (const category of categories) {
    const { data: subcategories, error: subError } = await supabase
      .from("sub_categories")
      .select("id, name")
      .eq("category_id", category.id);

    if (subError) continue;

    const subHierarchy: Record<string, { id: number; name: string }[]> = {};

    for (const subcategory of subcategories) {
      const { data: services, error: srvError } = await supabase
        .from("services")
        .select("id, name")
        .eq("sub_categories_id", subcategory.id);

      if (srvError) continue;

      subHierarchy[capitalizeWords(subcategory.name)] = services.map((srv) => ({
        id: srv.id,
        name: capitalizeWords(srv.name),
      }));
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
