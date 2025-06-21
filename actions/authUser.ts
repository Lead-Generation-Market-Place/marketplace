"use server";

import { createClient } from "@/utils/supabase/server";

// insert into pro_services table

export const getAuthUserId = async () => {
  const supabase = await createClient();

  // Get current authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated: " + (userError?.message || "No user"));
  }

  // No longer inserting into pro_services table
  return user.id;
};