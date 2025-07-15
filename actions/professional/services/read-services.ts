"use server";

import { createClient } from "@/utils/supabase/server";

export const Provider = async () => {
  const supabase = await createClient();

  // Step 1: Get authenticated user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user = userData?.user;
  if (userError || !user) {
    return {
      data: null,
      error: userError?.message || "User not authenticated",
      state: "error",
    };
  }

  // Step 1: Define the columns to select, including nested relationships
  const selectQuery = `
  business_name,
  provider_locations (
    id,
    state_id,
    locations (
      id,
      state
    )
  )
`;
  // Step 2: Perform the query with efficient join to fetch provider and location data
  const { data: providerData, error: providerError } = await supabase
    .from("service_providers")
    .select(selectQuery)
    .eq("user_id", user.id)
    .maybeSingle(); // avoids throwing if no result

  if (providerError) {
    return {
      data: null,
      error: providerError.message,
      state: "error",
    };
  }

  return {
    data: providerData,
    error: null,
    state: "success",
  };
};

export async function GetServices() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return {
      data: null,
      error: userError?.message || "User not authenticated",
      state: "error",
    };
  }

  const userId = userData.user.id;

  const { data, error } = await supabase
    .from("pro_services")
    .select(
      `
      service_id,
      status,
      services (
        id,
        name
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    return { data: null, error: error.message, state: "error" };
  }

  const mergedData = (data ?? []).map((item) => {
    // SAFELY extract services as a single object, even if it's an array
    const service = Array.isArray(item.services)
      ? item.services[0]
      : item.services;

    return {
      id: service?.id ?? item.service_id,
      name: service?.name ?? "Unknown",
      status: item.status === "active",
    };
  });

  return {
    data: mergedData,
    error: null,
    state: "success",
  };
}

export async function UpdateServiceStatus(serviceId: string, status: boolean) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return {
      data: null,
      error: userError?.message || "User not authenticated",
      state: "error",
    };
  }

  const userId = userData.user.id;

  const { data, error } = await supabase
    .from("pro_services")
    .update({ status: status ? "active" : "inactive" })
    .eq("user_id", userId)
    .eq("service_id", serviceId);

  if (error) {
    return { data: null, error: error.message, state: "error" };
  }

  return { data, error: null, state: "success" };
}
