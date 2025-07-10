"use server";

import { createClient } from "@/utils/supabase/server";

export async function saveCoordinates({
  lat,
  lng,
  radiusMiles,
}: {
  lat: number;
  lng: number;
  radiusMiles?: number;
}) {
  const supabase = await createClient();

  // Convert to PostGIS compatible format (WKT)
  const pointWKT = `SRID=4326;POINT(${lng} ${lat})`;

  const { error } = await supabase.from("service_locations").insert({
    lat,
    lng,
    coordinates: pointWKT,
    coverage_radius_miles: radiusMiles ,
  });

  if (error) {
    throw new Error("Failed to save location: " + error.message);
  }

  return { success: true };
}
