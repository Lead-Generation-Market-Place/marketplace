// app/actions/user/profile.ts (or wherever you organize server actions)

"use server";

import { createClient } from "@/utils/supabase/server";

export const getUserProfile = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("users_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return { error: profileError.message };
  }
  

  return { profile,user };
};
