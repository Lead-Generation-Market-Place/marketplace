// app/api/send-review-request/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

async function getUserForEmail() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }

  const { data: userData, error: userError } = await supabase
    .from('users_profiles')
    .select('username')
    .eq('id', data.user?.id)
    .single();

  if (userError) {
    throw new Error(`Failed to get user data: ${userError.message}`);
  }

  const {data: serviceProviderData, error: serviceProviderError} = await supabase
    .from('service_providers')
    .select('image_url')
    .eq('user_id', data.user?.id)
    .single();

  if (serviceProviderError) {
    throw new Error(`Failed to get service provider data: ${serviceProviderError.message}`);
  }
  return {
    username: userData.username,    
    imageUrl: serviceProviderData?.image_url || null,
  }}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { recipientEmail, userName, reviewLink } = body;

  if (!recipientEmail || !userName || !reviewLink) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const senderUsername = await getUserForEmail();

    const htmlContent = `
      <div style="max-width:600px;margin:0 auto;padding:20px;font-family:sans-serif;text-align:center;background:#fff;color:#1e293b">
        <h2 style="font-size:24px;color:#0077B6;margin-bottom:4px">${userName}</h2>
        <p style="font-size:14px;color:#64748b;margin:0 0 20px">Review Request</p>

        <img src="${senderUsername.imageUrl}" alt="User Avatar" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid #0077B6;margin:0 auto 6px" />

        <p style="font-size:16px;margin-bottom:12px">
          Thank you for being a valued client. I’ve recently joined Yeplax to connect with more clients like you, and your feedback helps me build credibility and trust.
        </p>

        <p style="font-size:14px;color:#475569;margin-bottom:20px">
          If you could take a moment to write a brief review about our collaboration, I’d greatly appreciate it. Your input makes a meaningful difference.
        </p>

        <div style="font-size:20px;color:#facc15;margin-bottom:16px">
          ★★★★★
        </div>

        <a href="${reviewLink}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#0077B6;color:#fff;padding:12px 24px;border-radius:8px;font-weight:bold;font-size:14px;text-decoration:none;margin-bottom:12px">
          Submit Review 
        </a>

        <p style="font-size:12px;color:#94a3b8;margin-top:12px">Requested by: <strong>${senderUsername.username}</strong></p>

        <div style="border-top:1px solid #e2e8f0;margin-top:24px;padding-top:16px;font-size:12px;color:#94a3b8">
          <div style="margin-bottom:12px;display:flex;justify-content:center;gap:16px">
          </div>

          <p style="margin:4px 0">© 2025 ${userName}.<br />415 Natoma Street, Suite 1300, San Francisco, CA 94103</p>
          <p style="margin-top:4px;font-weight:bold;color:#64748b">Help</p>
          <div style="margin-top:8px;display:flex;justify-content:center;">
          </div>
        </div>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'admin@clarksconstructioncompany.com',
      to: recipientEmail,
      subject: `Review Request for ${senderUsername.username} – from ${userName}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
