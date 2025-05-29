'use server'
import { createClient } from "@/utils/supabase/server";


import { revalidatePath } from 'next/cache'

const allServices = [
  'TV Mounting',
  'TV Repair Services',
  'Home Theater System Installation or Replacement',
  'Home Theater System Repair or Service',
  'Satellite Dish Services',
]

export async function handleServiceSubmit(formData: FormData) {
  const supabase = await createClient();
  const selected = allServices.filter(label => {
    const id = label.toLowerCase().replace(/\s+/g, '_')
    return formData.get(id) === 'on'
  })

  const userId = 'user-id-placeholder' // TODO: Replace with actual Supabase user ID
  const { error } = await supabase
    .from('user_services')
    .upsert({ user_id: userId, services: selected })

  if (error) throw new Error('Failed to save services')
  revalidatePath('/')
}
