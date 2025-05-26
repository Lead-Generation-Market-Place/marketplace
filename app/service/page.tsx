import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import SearchResult from '@/components/home/SearchResult';

export const dynamic = 'force-dynamic';

export default async function ServicePage({ searchParams }: { searchParams: { search?: string; zipcode?: string } }) {
  const supabase = createServerComponentClient({ cookies });

  const { data: categories, error } = await supabase.from('categories').select('id, name');

  const search = searchParams.search || '';
  const zipcode = searchParams.zipcode || '';

  return (
    <SearchResult
      categories={categories || []}
      search={search}
      zipcode={zipcode}
      fetchError={error ? error.message : null}
    />
  );
}
