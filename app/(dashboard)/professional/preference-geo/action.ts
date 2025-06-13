// lib/getPoints.ts
'use server';

import { createClient } from "@/utils/supabase/server";


export async function getPointsByCity(city: string) {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('your_table_name') // replace with your table
      .select('lat, lng')
      .eq('city', city);

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const points = data.map((row: { lat: number; lng: number }) => [row.lat, row.lng]);

    return points;
  } catch (error) {
    console.error('Server Action error:', error);
    return [];
  }
}
