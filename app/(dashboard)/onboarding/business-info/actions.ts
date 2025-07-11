'use server'

import { createClient } from "@/utils/supabase/server"

function formDataToObject(formData: FormData): Record<string, string | File> {
  const obj: Record<string, string | File> = {}
  formData.forEach((value, key) => {
    obj[key] = value
  })
  return obj
}

export async function businessInfo(formData: FormData) {
  const supabase = await createClient()
  const payload = formDataToObject(formData)

  const {
    businessName,
    founded,
    employees,
    businessType,
    streetAddress,
    suite,
    state,
    postalCode,
    about,
    image,
    city,
    timezone,
  } = payload as {
    businessName: string
    founded: string
    employees?: string
    businessType: string
    streetAddress?: string
    suite?: string
    state?: string
    postalCode?: string
    about: string
    image: File
    city?: string
    timezone?: string
  }

  // Validate image
  if (!(image instanceof File) || image.size === 0 || !image.type.startsWith("image/")) {
    return {
      status: "error",
      message: "A valid image file is required.",
      user: null,
    }
  }

  // Upload image
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("business-logos")
    .upload(`logos/${crypto.randomUUID()}_${image.name}`, image)

 if (uploadError || !uploadData) {
  return {
    status: "error",
    message: uploadError?.message ?? "Failed to upload image",
    error: uploadError,
    user: null,
  }

  }

  const { data } = supabase.storage.from("business-logos").getPublicUrl(uploadData.path)
  if (!data || !data.publicUrl) {
    return {
      status: "error",
      message: "Failed to generate public image URL",
      user: null,
    }
  }
  const publicImageUrl: string = data.publicUrl

  // Get authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user?.id) {
    return {
      status: "error",
      message: userError?.message ?? "No authenticated user found.",
      user: null,
    }
  }

  // Step 1: Upsert into service_providers (update if exists, insert if not)
  const { data: existingProvider } = await supabase
    .from("service_providers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  let insertedProvider;
  let insertProviderError;
  if (existingProvider) {
    // Update existing provider
    const { data: updatedProvider, error: updateError } = await supabase
      .from("service_providers")
      .update({
        business_name: businessName,
        founded_year: Number(founded),
        employees_count: employees ? Number(employees) : null,
        business_type: businessType,
        introduction: about,
        image_url: publicImageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single();
    insertedProvider = updatedProvider;
    insertProviderError = updateError;
  } else {
    // Insert new provider
    const { data: newProvider, error: newInsertError } = await supabase
      .from("service_providers")
      .insert({
        provider_id: crypto.randomUUID(),
        user_id: user.id,
        business_name: businessName,
        founded_year: Number(founded),
        employees_count: employees ? Number(employees) : null,
        business_type: businessType,
        introduction: about,
        image_url: publicImageUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    insertedProvider = newProvider;
    insertProviderError = newInsertError;
  }

  if (insertProviderError || !insertedProvider) {
    return {
      status: "error",
      message: insertProviderError?.message ?? "Failed to upsert service provider",
      user: null,
    }
  }

  // Step 2: Insert into locations
  const { data: insertedLocation, error: insertLocationError } = await supabase
    .from("locations")
    .insert({
      address_line1: streetAddress ?? null,
      address_line2: suite ?? null,
      city: city ?? null,
      state: state ?? null,
      zip: postalCode ?? null,
      timezone: timezone ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (insertLocationError || !insertedLocation) {
    return {
      status: "error",
      message: insertLocationError?.message ?? "Failed to insert location",
      user: null,
    }
  }



  // Step 3: Insert into provider_locations (join table)
  const { error: joinInsertError } = await supabase
    .from("provider_locations")
    .insert({
      provider_id: insertedProvider.provider_id,
      state_id: insertedLocation.id,
      is_primary: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

  if (joinInsertError) {
    return {
      status: "error",
      message: joinInsertError.message,
      user: null,
    }
  }

    // Step 4: Update user role in users_profiles
  const { error: updateRoleError } = await supabase
    .from("users_profiles")
    .update({ roles: "Professional" })
    .eq("id", user.id)

  if (updateRoleError) {
    return {
      status: "error",
      message: updateRoleError.message ?? "Failed to update user role",
      user: null,
    }
  }


  return {
    status: "success",
    user: insertedProvider,
    location: insertedLocation,
  }
}
