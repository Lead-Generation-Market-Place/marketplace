'use server';

import { createClient } from '@/utils/supabase/server';

export interface ServiceQuestion {
  id: number;
  service_id: number;
  step: number;
  form_type: string;
  question: string;
  options: string[]; // JSONB array in Supabase
  form_group: string;
}

export async function GetServiceQuestionsById(serviceId: number): Promise<ServiceQuestion[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('service_request_forms')
    .select('*')
    .eq('service_id', serviceId);

  if (error) {
    throw new Error(`Failed to get service questions: ${error.message}`);
  }

  return data as ServiceQuestion[];
}
