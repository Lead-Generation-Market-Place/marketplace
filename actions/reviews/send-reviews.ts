import { createClient } from "@/utils/supabase/server";

export async function SendReviews() {
  const supabase = await createClient();

  // Get authenticated user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return {
      status: 'error',
      message: `Failed to get user: ${userError?.message}`,
      code: 'AUTH_ERROR',
    };
  }

  const userId = userData.user.id;

  // Get professional details
  const { data: professional, error: professionalError } = await supabase
    .from("service_providers")
    .select("business_name, image_url")
    .eq("user_id", userId)
    .single();

  if (professionalError) {
    return {
      status: 'error',
      message: `Failed to fetch provider info: ${professionalError.message}`,
      code: 'PROVIDER_FETCH_FAILED',
    };
  }

  return {
    status: 'success',
    userId: userId,
    username: professional?.business_name || "Unknown",
    imageUrl: professional?.image_url || null,
  };
}
