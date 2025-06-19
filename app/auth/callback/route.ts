import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/home";
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.log("Error fetching user data", userError.message);
        return NextResponse.redirect(`${origin}/error`);
      }
      const { data: UserExits } = await supabase
        .from("users_profiles")
        .select("*")
        .eq("email", data?.user?.email)
        .limit(1)
        .single();

      if (!UserExits) {
        // Fallback for username: user_name, name, email, or 'unknown'
        let username = data?.user?.user_metadata?.user_name || data?.user?.user_metadata?.name || data?.user?.email || 'unknown';
        // Check for username uniqueness
        const { data: usernameExists } = await supabase
          .from("users_profiles")
          .select("*")
          .eq("username", username)
          .limit(1)
          .single();
        if (usernameExists) {
          // Append random 4-digit number to make it unique
          username = `${username}_${Math.floor(1000 + Math.random() * 9000)}`;
        }
        const { error: dbError } = await supabase
          .from("users_profiles")
          .insert({
            email: data?.user?.email,
            username,
          });
        if (dbError) {
          console.log("Error inserting user profile:", dbError.message);
          return NextResponse.redirect(`${origin}/error?msg=${encodeURIComponent(dbError.message)}`);
        }
      }
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
