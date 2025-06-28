"use server";

import { createClient } from "@/utils/supabase/server";

// insert into pro_services table

export const insertSelectedServices = async (service_ids: number[]) => {
  const supabase = await createClient();

  // Get current authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated: " + (userError?.message || "No user"));
  }

const user_id = user.id;

  // Prepare batch insert data
  const insertData = service_ids.map((service_id) => ({
    user_id,
    service_id,
  }));

  const { data, error } = await supabase.from("pro_services").insert(insertData);

  if (error) {
    throw new Error("Failed to insert services: " + error.message);
  }

  return data;
};

// This server action receives a comma-separated string of service IDs from a form and inserts them for the current provider
export async function insertServicesAction(formData: FormData) {
  const idsString = (formData.get("service_ids") as string)?.trim();
  if (!idsString) throw new Error("No service_ids provided");
  // Split, trim, convert to number, and filter out NaN/empty
  const serviceIds = idsString
    .split(",")
    .map((id) => Number(id.trim()))
    .filter((id) => !isNaN(id) && id > 0);
  return await insertSelectedServices(serviceIds);
}

