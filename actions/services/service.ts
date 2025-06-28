"use server";

import { createClient } from "@/utils/supabase/server";


// Capitalize each word
const capitalizeWords = (str: string): string =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());


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
  plan_status: string
) => {
  // Get the current user using the reusable utility
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Could not get current user" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("plan")
    .insert([{ user_id: user.id, service_id, plan_status }]);

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
    .select("id, plan_status, user_id, service:service_id(id, name)")
    .eq("user_id", user.id)
    .eq("plan_status", "todo")
    .order("id", { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};

export const getCompletedPlans = async () => {
  const user = await getCurrentUser();
  if(!user) {
    return {success: false, error:"Could not get the current user"};
  }
  const supabase = await createClient();
  const {data, error} = await supabase
  .from("plan")
  .select("id, plan_status,created_at, user_id, service:service_id(id, name)")
  .eq("user_id", user.id)
  .eq("plan_status", "done")
  .order("id", {ascending: true});
  if (error) {
    return {success:false, error: error.message }
  }
  return {success:true, data};

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
    .from("state")
    .select("name")
    .ilike("name", `%${query}%`)
    .limit(10);

  if (error) {
    console.error("Location suggestion error:", error.message);
    return [];
  }

  const suggestions = new Set<string>();

  data.forEach(({ name }) => {
    if (name && name.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(capitalizeWords(name));
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

export async function markPlanAsCompleted(planId: string) {
  const supabase = await createClient();
  console.log(planId);
  const { data, error } = await supabase
    .from("plan")
    .update({ plan_status: "done" })
    .eq("id", planId);

  if (error) {
    throw new Error(`Failed to update plan: ${error.message}`);
  }

  return data;
}


