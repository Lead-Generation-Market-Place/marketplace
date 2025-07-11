// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

// 🧠 Centralized route-role mapping
const rolePaths: Record<string, string> = {
  "/customers": "customer",
  "/professional": "professional",
};

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  const pathname = request.nextUrl.pathname;

  try {
    // 🔐 Authenticated user (verifies token server-side)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 🔍 Fetch user profile & role
    const { data: profile, error: profileError } = await supabase
      .from("users_profiles")
      .select("roles")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.roles) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    const role = profile.roles.toLowerCase(); // Normalize for safety

    // 🔒 Check role-based access
    for (const pathPrefix in rolePaths) {
      if (pathname.startsWith(pathPrefix)) {
        const requiredRole = rolePaths[pathPrefix];
        if (role !== requiredRole) {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
      }
    }
    return response;
  } catch (err) {
    return NextResponse.redirect(new URL(`/error${err}`, request.url)); // optional: create this page
  }
}

// 🔍 Matcher only runs middleware on protected routes
export const config = {
  matcher: ["/customers/:path*", "/professional/:path*"],
};
