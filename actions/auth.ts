"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
//import { headers } from "next/headers";

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

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const credentials = {
    email: formData.get("email") as string,
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  const { error, data } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        username: credentials.username,
      },
    },
  });
  if (error) {
    return {
      status: error?.message,
      user: null,
    };
  } else if (data?.user?.identities?.length === 0) {
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

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const credentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error, data } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    return {
      status: error?.message,
      user: null,
    };
  }

  const { data: userExist } = await supabase
    .from("users_profiles")
    .select("*")
    .eq("email", credentials.email)
    .limit(1)
    .single();
  if (!userExist) {
    const { error: InserError } = await supabase.from("users_profiles").insert({
      email: data?.user.email,
      username: data?.user.user_metadata.username,
    });
    if (InserError) {
      return {
        status: InserError?.message,
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

export async function logOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function signInWithGithub() {
  const origin = (await headers()).get("origin");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });
  if (error) {
    redirect("/error");
  } else if (data.url) {
    return redirect(data.url);
  }
}

export async function signInWithGoogle() {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });
  if (error) {
    redirect("/error");
  }
  if (data?.url) {
    redirect(data.url);
  }
  // Optionally handle unexpected state here if needed
}


export async function UnPassword(formData: FormData) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string,
    {
      redirectTo: `${origin}/reset-password`,
    }
  );
  if (error) {
    return {
      status: error?.message,
    };
  }
  return {
    status: "success",
  };
}

export async function resetLink(formData: FormData, code: string) {
  const supabase = await createClient();
  const { error: setError } = await supabase.auth.exchangeCodeForSession(code);
  if (setError) {
    return { status: setError?.message };
  }

  const { error } = await supabase.auth.updateUser({
    password: formData.get("password") as string,
  });
    if (error) {
    return { status: error?.message };
  }
  return { status: "success" };
}
