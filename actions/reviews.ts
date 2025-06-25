'use server';

import { createClient } from '@/utils/supabase/server';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema with expected field names
const schema = z.object({
  userId: z.string().uuid(),              // reviewer (user) ID
  provider_id: z.string().uuid(),         // reviewed provider ID
  reviewer_name: z.string().min(1),
  reviewer_last_name: z.string().min(1),
  reviewer_email: z.string().email(),
  rating: z.string().refine(val => {
    const num = Number(val);
    return !isNaN(num) && num >= 1 && num <= 5;
  }, { message: 'Rating must be a number between 1 and 5' }),
  review_text: z.string().optional(),
  password: z.string().min(1),
});

/**
 * Submit a review.
 * @param formData - FormData object from the client
 * @param provider_id_param - The ID of the provider being reviewed (from route or props)
 */
export async function SubmitReviews(formData: FormData, provider_id_param: string) {
  try {
    const raw = Object.fromEntries(formData.entries());

    // 🔁 Map form field names to schema keys
    const mappedData = {
      userId: raw.userId,                   // reviewer user ID from field "providerid"
      provider_id: provider_id_param,           // passed from route or parent component
      reviewer_name: raw.firstName,
      reviewer_last_name: raw.lastName,
      reviewer_email: raw.email,
      rating: raw.rating,
      review_text: raw.comment,
      password: raw.password,               // password for verification
    };

    // ✅ Validate mapped input
    const parsed = schema.safeParse(mappedData);
    if (!parsed.success) {
      console.error('Validation failed:', parsed.error.format());
      console.error('Flattened errors:', parsed.error.flatten());
      return {
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      };
    }

    const {
      userId,
      reviewer_name,
      reviewer_last_name,
      reviewer_email,
      review_text,
      rating,
    } = parsed.data;

    const supabase = await createClient();

    // 🔍 Check if provider exists
    const { data: provider, error: providerError } = await supabase
      .from('service_providers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (providerError || !provider) {
      console.error('Provider not found:', providerError);
      toast.error('Provider not found.');
      return {
        status: 'error',
        message: 'Provider not found.',
      };
    }

    const providerId = provider.id;
    // 🖼️ Upload photo attachments
    const mediaUrls: string[] = [];

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('photo_') && value instanceof File) {
        const file = value;
        const uploadPath = `photos/${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
          .from('reviews')
          .upload(uploadPath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          console.error('Photo upload error:', error);
          return {
            status: 'error',
            message: 'Failed to upload a photo. Please try again.',
          };
        }

        const publicUrl = supabase.storage.from('reviews').getPublicUrl(data.path);
        if (publicUrl.data?.publicUrl) {
          mediaUrls.push(publicUrl.data.publicUrl);
        }
      }
    }

    // 💾 Insert review into Supabase
    const { error: insertError } = await supabase.from('reviews').insert({
      provider_id:providerId,
      reviewer_id: userId,
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
      console.error('Insert error:', insertError.message, insertError.details, insertError.hint);
      return {
        status: 'error',
        message: 'Failed to save review.',
      };
    }

    // ✅ Success response
    return { status: 'success' };

  } catch (err) {
    console.error('Unexpected error:', err);
    return {
      status: 'error',
      message: 'Unexpected server error. Please try again later.',
    };
  }
}
