"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
//import { headers } from "next/headers";

export async function getUserSession()
{
  const supabase = await createClient()
  const {data, error} = await supabase.auth.getSession();
  if(error)
  {
    return null;
  }
    return {
      status: "success",
      user: data.session?.user
    }
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
