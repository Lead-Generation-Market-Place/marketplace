import { createClient } from '@/utils/supabase/client';
import SearchResult from '@/components/home/SearchResult';


export const dynamic = 'force-dynamic';

export default async function ServicePage({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const supabase = createClient();
  const { data: categories, error } = await supabase
    .from('category')
    .select('*');

  const params = await searchParams;
  const searchKey = params.search || '';
  const zipCode = params.zipcode || '';
  const locationInfo = params.locationInfo || '';

  return (
    <SearchResult
      categories={categories || []}
      search={searchKey}
      zipcode={zipCode}
      location={locationInfo}
      fetchError={error?.message || null}
    />
  );
}
