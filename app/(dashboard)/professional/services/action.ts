'use server';

import { createClient } from "@/utils/supabase/server";

function capitalizeWords(str: string) {
  if (!str) return str;
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export const SearchServices = async () => {
  const supabase = await createClient();
  const { data: serviceData, error } = await supabase
    .from('services')
    .select('*');

  if (error) {
    return {
      status: 'error',
      message: error.message,
      data: null,
    };
  }

  if (!serviceData || !Array.isArray(serviceData)) {
    return {
      status: 'error',
      message: 'No service data found or data is not an array',
      data: null,
    };
  }

  // Capitalize each word safely
  const capitalizedData = serviceData.map((service) => {
    let name = service.name;
    if (typeof name === 'string') {
      name = capitalizeWords(name);
    }
    return {
      ...service,
      name,
    };
  });

  return {
    status: 'success',
    data: capitalizedData,
  };
};
