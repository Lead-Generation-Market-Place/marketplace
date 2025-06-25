'use server';

import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

// Schema for form validation
const schema = z.object({
  userId: z.string().uuid(),              // Provider ID
  provider_id: z.string().uuid(),         // Provider ID again? This looks like a mistake.
  reviewer_name: z.string().min(3),
  reviewer_last_name: z.string().min(3),
  reviewer_email: z.string().email(),
  rating: z.string().refine(val => {
    const num = Number(val);
    return !isNaN(num) && num >= 1 && num <= 5;
  }, { message: 'Rating must be a number between 1 and 5' }),
  review_text: z.string().optional(),
  password: z.string().min(6),
});

export async function SubmitReviews(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData.entries());

    const mappedData = {
      userId: raw.userId,             // This should be provider_id!
      provider_id: raw.userId,        // We'll revise this properly below.
      reviewer_name: raw.firstName,
      reviewer_last_name: raw.lastName,
      reviewer_email: raw.email,
      rating: raw.rating,
      review_text: raw.comment,
      password: raw.password,
    };

    const parsed = schema.safeParse(mappedData);
    if (!parsed.success) {
      return {
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      };
    }

    const {
      userId: provider_id,
      reviewer_name,
      reviewer_last_name,
      reviewer_email,
      review_text,
      rating,
      password,
    } = parsed.data;

    const supabase = await createClient();

    // Step 1: Check if reviewer already exists in users_profiles
    let reviewerUserId: string | null = null;

    const { data: existingUser} = await supabase
      .from('users_profiles')
      .select('id')
      .eq('email', reviewer_email)
      .single();

    if (existingUser?.id) {
      reviewerUserId = existingUser.id;
    } else {
      // Step 2: Create a new user in Supabase Auth
      const randomPassword = password || Math.random().toString(36).slice(-8);

      const { data: authUser, error: signUpError } = await supabase.auth.signUp({
        email: reviewer_email,
        password: randomPassword,
        options: {
          data: {
            first_name: reviewer_name,
          last_name: reviewer_last_name,
          }
        },
      });


      if (signUpError || !authUser.user?.id) {
        console.error('Auth user creation failed:', signUpError?.message);
        return {
          status: 'error',
          message: 'Failed to create new reviewer account.',
        };
      }

      reviewerUserId = authUser.user.id;
    }

    // Step 3: Upload photos
    const mediaUrls: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('photo_') && value instanceof File) {
        const uploadPath = `photos/${Date.now()}-${value.name}`;
        const { data, error } = await supabase.storage
          .from('reviews')
          .upload(uploadPath, value, { cacheControl: '3600', upsert: false });

        if (error) {
          return {
            status: 'error',
            message: 'Failed to upload photo.',
          };
        }

        const { data: urlData } = supabase.storage.from('reviews').getPublicUrl(data.path);
        if (urlData?.publicUrl) {
          mediaUrls.push(urlData.publicUrl);
        }
      }
    }

    // Step 4: Insert review
    const { error: insertError } = await supabase.from('reviews').insert({
      reviewerUserId: reviewerUserId,
      providerUser_id: provider_id,
      reviewer_name,
      reviewer_last_name,
      reviewer_email,
      rating: Number(rating),
      review_text: review_text ?? null,
      media_attachment_url: mediaUrls.length > 0 ? mediaUrls : null,
      is_verified: false,
      review_source: 'manual',
      is_visible: true,
      status: 'pending',
      helpful_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      return {
        status: 'error',
        message: 'Failed to save review.',
      };
    }

    return { status: 'success' };
  } catch (err) {
    console.error('Unexpected error:', err);
    return {
      status: 'error',
      message: 'Unexpected server error.',
    };
  }
}
