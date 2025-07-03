'use server';

import { createClient } from '@/utils/supabase/server';

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function getServicesByIds(ids: number[]) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('services')
    .select('id, name')
    .in('id', ids);

  if (error) {
    console.error('Supabase error:', error.message);
    return [];
  }

  // Capitalize first letter of each word in the name
  const formattedData = data.map((service) => ({
    ...service,
    name: capitalizeWords(service.name),
  }));

  return formattedData;
}
