import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

type Category = {
  id: number;
  name: string;
};

export default function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      const client = createClient();
      const { data, error } = await client.from('category').select('*');
      if (error) setError(error.message);
      else setCategories(data ?? []);
    }
    fetchCategories();
  }, []);

  return { categories, error };
}