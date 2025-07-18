import { createClient } from "@/utils/supabase/server";

export async function GetZipeStateCodes() {
  const supabase = await createClient();

  // Explicitly select only the fields we need
  const { data, error } = await supabase
    .from("cities")
    .select("id, zip, lat, lng, city, state_name", { count: "exact", head: false })
    .range(0, 99999); // Fetch up to 100,000 rows


  if (error) {
    return {
      success: false,
      error: error.message,
      data: null
    };
  }

  if (!data) {
    return {
      success: false,
      error: "No data found",
      data: null
    };
  }

  // Convert BigInt values to strings if needed
  const serializedData = data.map(item => ({
    ...item,
    zip: item.zip?.toString() // Convert BigInt to string if needed
  }));

  return {
    success: true,
    data: serializedData
  };
}