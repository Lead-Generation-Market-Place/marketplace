'use server';

import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const schema = z.object({
  userId: z.string().uuid(),
  provider_id: z.string().uuid(),
  reviewer_name: z.string().min(3, "First name must be at least 3 characters"),
  reviewer_last_name: z.string().min(3, "Last name must be at least 3 characters"),
  reviewer_email: z.string().email("Please enter a valid email address"),
  rating: z.string().refine(val => {
    const num = Number(val);
    return !isNaN(num) && num >= 1 && num <= 5;
  }, { message: 'Rating must be a number between 1 and 5' }),
  review_text: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  selectedTags: z.union([
    z.string().transform(val => JSON.parse(val)),
    z.array(z.string())
  ])
});

export async function SubmitReviews(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData.entries());

    const mappedData = {
      userId: raw.userId,
      provider_id: raw.userId,
      reviewer_name: raw.firstName,
      reviewer_last_name: raw.lastName,
      reviewer_email: raw.email,
      rating: raw.rating,
      review_text: raw.comment,
      password: raw.password,
      selectedTags: raw.selectedTags,
    };

    const parsed = schema.safeParse(mappedData);
    if (!parsed.success) {
      return {
        status: 'error',
        message: 'Please fix the errors in the form',
        errors: parsed.error.flatten(),
        code: 'VALIDATION_ERROR'
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
      selectedTags
    } = parsed.data;

    const supabase = await createClient();
    let reviewerUserId: string | null = null;

    // Check if reviewer exists
    const { data: existingUser } = await supabase
      .from('users_profiles')
      .select('id')
      .eq('email', reviewer_email)
      .single();



    if (existingUser?.id) {
      if (!password) {
        return {
          status: 'error',
          message: 'Password is required for existing accounts',
          code: 'PASSWORD_REQUIRED',
          field: 'password'
        };
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: reviewer_email,
        password: password,
      });

      if (loginError) {
        return {
          status: 'error',
          message: 'Incorrect password',
          code: 'INVALID_PASSWORD',
          field: 'password'
        };
      }

      reviewerUserId = existingUser.id;
    } else {
      const randomPassword = password || Math.random().toString(36).slice(-8);

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: reviewer_email,
        password: randomPassword,
        options: {
          data: {
            first_name: reviewer_name,
            last_name: reviewer_last_name,
          }
        },
      });

      if (signUpError) {
        return {
          status: 'error',
          message: signUpError.message || 'Failed to create account',
          code: 'SIGNUP_FAILED'
        };
      }

      if (!signUpData.user?.id) {
        return {
          status: 'error',
          message: 'Account creation failed - no user ID returned',
          code: 'USER_ID_MISSING'
        };
      }

      reviewerUserId = signUpData.user.id;
    }

    // Upload photos
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
            message: `Failed to upload ${value.name}`,
            code: 'PHOTO_UPLOAD_FAILED',
            file: value.name
          };
        }

        const { data: urlData } = supabase.storage.from('reviews').getPublicUrl(data.path);
        if (urlData?.publicUrl) {
          mediaUrls.push(urlData.publicUrl);
        }
      }
    }

    // Insert review
    const { error: insertError } = await supabase.from('reviews').insert({
      reviewerUserId,
      providerUser_id: provider_id,
      reviewer_name,
      reviewer_last_name,
      reviewer_email,
      rating: Number(rating),
      review_text: review_text ?? null,
      tags: selectedTags,
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
        message: 'Failed to save your review',
        code: 'REVIEW_SAVE_FAILED',
        details: insertError.message
      };
    }

    return { 
      status: 'success',
      message: 'Thank you! Your review has been submitted successfully.'
    };
  } catch (err) {
    console.error('Unexpected error:', err);
    return {
      status: 'error',
      message: 'An unexpected error occurred',
      code: 'SERVER_ERROR',
      details: err instanceof Error ? err.message : String(err)
    };
  }
}

export async function fetchProfessional(userId: string) {
  const supabase = await createClient();

  const { data: professionalName, error: professionalError } = await supabase
    .from('service_providers')
    .select("business_name")
    .eq('user_id', userId)
    .single();

  if (professionalError) {
    console.error("Fetch error:", professionalError.message);
    return null;
  }

  return professionalName;
}