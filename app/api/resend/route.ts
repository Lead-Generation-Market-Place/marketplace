import { EmailTemplate } from "@/components/emails/email-template";
import KoalaWelcomeEmail from "@/components/emails/welcomeEmail";
import PasswordResetConfirmationEmail from "@/components/emails/resetConfirmationEmail";
import { createAdminClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { type, email, password, IsPasswordReset, origin } =
      await request.json();
    if (!email) {
      return Response.json({ error: "Email is required." }, { status: 400 });
    }

    let data;
    switch (type) {
      case "verification":
        data = { message: "Verification email sent." };
        const supabase = createAdminClient();
        const res = await supabase.auth.admin.generateLink({
          type: IsPasswordReset ? "recovery" : "signup",
          email,
          password: IsPasswordReset ? undefined : password,
        });



        if (res.data.properties?.email_otp) {
          data = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: IsPasswordReset ? "Password Reset" : "Verify your email",
            react: await EmailTemplate({
              otp: res.data.properties?.email_otp,
              IsPasswordReset: !!IsPasswordReset,
            }),
          });
        } else {
          return NextResponse.json({ data: null, error: res.error });
        }

        break;
      case "welcome":
        const dashboardUrl = origin
          ? `${origin}/dashboard`
          : `${new URL(request.url).origin}/dashboard`;
        data = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Welcome to our platform!",
          react: KoalaWelcomeEmail({
            email: email,
            dashboardUrl,
          }),
        });
        break;
      case "password-reset-confirmation":
        const loginUrl = origin
          ? `${origin}/auth/login`
          : `${new URL(request.url).origin}/auth/login`;
        data = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Your password has been reset",
          react: PasswordResetConfirmationEmail({
            userEmail: email,
            loginUrl,
          }),
        });
        break;
      default:
        data = { message: "Unknown type." };
    }
    return Response.json({ data });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
