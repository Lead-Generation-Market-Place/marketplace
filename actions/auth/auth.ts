"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

// ──────────────────────────────────────────────
// 1. Define Zod schemas for all form-based actions
// ──────────────────────────────────────────────

// Sign-up schema: email, username, password, confirmPassword
const signUpSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// Sign-in schema: email & password
const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Forgot-password (UnPassword) schema: email only
const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

// Reset-password schema: password & confirmPassword
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
  })
 

// ──────────────────────────────────────────────
// 2. Helper to turn FormData into a plain object
// ──────────────────────────────────────────────
function formDataToObject(formData: FormData): Record<string, string | File> {
  const obj: Record<string, string | File> = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}


// ──────────────────────────────────────────────
// 3. getUserSession (no change needed)
// ──────────────────────────────────────────────
export async function getUserSession() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  return {
    status: "success",
    user: data?.user,
  };
}

// ──────────────────────────────────────────────
// 4. signUp: validate via Zod, then supabase.auth.signUp
// ──────────────────────────────────────────────
export async function signUp(formData: FormData) {
  // 1) Convert FormData ➔ object
  const payload = formDataToObject(formData);

  // 2) Validate with Zod
  const parsed = signUpSchema.safeParse(payload);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return {
      status: firstError.message,
      user: null,
    };
  }
  const { email, username, password } = parsed.data;

  // 3) Proceed with Supabase sign-up
  const supabase = await createClient();
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (error) {
    return {
      status: error.message,
      user: null,
    };
  } else if (data.user?.identities?.length === 0) {
    return {
      status: "User with this email already exists",
      user: null,
    };
  }

  revalidatePath("/", "layout");
  return {
    status: "success",
    user: data.user,
  };
}

// ──────────────────────────────────────────────
// 5. signIn: validate via Zod, then supabase.auth.signInWithPassword
// ──────────────────────────────────────────────
export async function signIn(formData: FormData) {
  // 1) Convert FormData ➔ object
  const payload = formDataToObject(formData);

  // 2) Validate with Zod
  const parsed = signInSchema.safeParse(payload);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return {
      status: firstError.message,
      user: null,
    };
  }
  const { email, password } = parsed.data;

  // 3) Proceed with Supabase sign-in
  const supabase = await createClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return {
      status: error.message,
      user: null,
    };
  }

  // 4) Ensure user profile exists in users_profiles
  const { data: userExist, error: fetchError } = await supabase
    .from("users_profiles")
    .select("*")
    .eq("email", email)
    .limit(1)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // Any error other than “no row found”
    return {
      status: fetchError.message,
      user: null,
    };
  }

  if (!userExist) {
    const { error: insertError } = await supabase.from("users_profiles").insert({
      email: data.user.email,
      username: data.user.user_metadata.username,
    });
    if (insertError) {
      return {
        status: insertError.message,
        user: null,
      };
    }
  }

  revalidatePath("/", "layout");
  return {
    status: "success",
    user: data.user,
  };
}

// ──────────────────────────────────────────────
// 6. logOut (no formData to validate)
// ──────────────────────────────────────────────
export async function logOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/login");
}

// ──────────────────────────────────────────────
// 7. signInWithGithub (no formData to validate)
// ──────────────────────────────────────────────
export async function signInWithGithub() {
  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error) {
    redirect("/error");
  } else if (data.url) {
    return redirect(data.url);
  }
}

// ──────────────────────────────────────────────
// 8. signInWithGoogle (no formData to validate)
// ──────────────────────────────────────────────
export async function signInWithGoogle() {
  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error) {
    redirect("/error");
  }
  if (data?.url) {
    // After redirect, user will be authenticated. Let's ensure user profile exists.
    // This logic should be handled in the /auth/callback route after redirect.
    // But for server actions, we can add a helper to be called after redirect.
    return redirect(data.url);
  }
}

// Helper to be called after OAuth callback to ensure user profile exists
export async function ensureUserProfileAfterOAuth() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      status: userError?.message || "User not authenticated after OAuth",
      user: null,
    };
  }

  // Check if user exists in users_profiles
  const { data: userExist, error: fetchError } = await supabase
    .from("users_profiles")
    .select("*")
    .eq("email", user.email)
    .limit(1)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    return {
      status: `Fetch error: ${fetchError.message}`,
      user: null,
    };
  }

  if (!userExist) {
    // Fallback for username: user_name, name, email, or 'unknown'
    const username = user.user_metadata?.user_name || user.user_metadata?.name || user.email || 'unknown';
    const { error: insertError } = await supabase.from("users_profiles").insert({
      email: user.email,
      username,
    });
    if (insertError) {
      return {
        status: `Insert error: ${insertError.message}`,
        user: null,
      };
    }
  }

  return {
    status: "success",
    user,
  };
}

// ──────────────────────────────────────────────
// 9. UnPassword (forgot password): validate email via Zod
// ──────────────────────────────────────────────
export async function UnPassword(formData: FormData) {
  // 1) Convert FormData ➔ object
  const payload = formDataToObject(formData);

  // 2) Validate with Zod
  const parsed = forgotPasswordSchema.safeParse(payload);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return { status: firstError.message };
  }
  const { email } = parsed.data;

  // 3) Proceed with Supabase password reset
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });
  if (error) {
    return { status: error.message };
  }
  return { status: "success" };
}

// ──────────────────────────────────────────────
// 10. resetLink (reset password): validate new password via Zod
// ──────────────────────────────────────────────
export async function resetLink(formData: FormData, code: string) {
  // 1) Convert FormData ➔ object
  const payload = formDataToObject(formData);

  // 2) Validate with resetPasswordSchema
  const parsed = resetPasswordSchema.safeParse(payload);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return { status: firstError.message };
  }
  const { password } = parsed.data;

  // 3) Exchange code for session
  const supabase = await createClient();
  const { error: setError } = await supabase.auth.exchangeCodeForSession(code);
  if (setError) {
    return { status: setError.message };
  }

  // 4) Update user password
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { status: error.message };
  }

  return { status: "success" };
}

// ──────────────────────────────────────────────
// 11. VerifyOtp (no formData validation needed here)
// ──────────────────────────────────────────────
export async function VerifyOtp() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      status: userError?.message || "User not authenticated after verification",
      user: null,
    };
  }

  return {
    status: "success",
    user,
  };
}

// ──────────────────────────────────────────────
// Helper to get user session and provider info after login
// ──────────────────────────────────────────────
export async function getUserAndProvider() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      provider: null,
      error: "Error retrieving user session.",
    };
  }

  const { data: provider, error: providerError } = await supabase
    .from("service_providers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (providerError && providerError.code !== "PGRST116") {
    return {
      user,
      provider: null,
      error: "Something went wrong. Try again.",
    };
  }

  return {
    user,
    provider,
    error: null,
  };
}
