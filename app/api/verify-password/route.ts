// app/api/verify-password/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { 
          valid: false, 
          error: error.message.includes('Invalid login credentials') 
            ? 'Incorrect email or password' 
            : error.message 
        },
        { status: 401 }
      );
    }

    // Successful authentication
    return NextResponse.json({ 
      valid: true,
      user: data.user 
    });

  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}