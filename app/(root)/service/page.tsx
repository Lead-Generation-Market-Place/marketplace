import { createClient } from '@/utils/supabase/client';
import SearchResult from '@/components/search/SearchResult';
import SearchFilter from '@/components/search/SearchFilter';
import ProsList from '@/components/search/ProsList';

export const dynamic = 'force-dynamic';

export default async function ServicePage({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const supabase = createClient();
  
  const params = await searchParams;
  const searchKey = params.search || '';
  const zipCode = params.zipcode || '';
  const locationInfo = params.locationInfo || '';
  const inputValue = searchKey.trim().toLowerCase();

  // Query for all categories
  const { data: categories, error } = await supabase
    .from('services')
    .select('*');
  
  // Query for exact match
  const { data: exactMatch, error: exactMatchError } = await supabase
    .from('services')
    .select('*')
    .eq('name', inputValue);

  if (error) {
    console.log(exactMatchError);
  }

  return (
    <>
      <div className="flex bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
        <div className="w-[20%] p-2 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
          <SearchFilter />
        </div>
        <div className="w-[80%] p-2 bg-white dark:bg-gray-900 transition-colors duration-300">
          <ProsList />
        </div>
      </div>
      {/* Overlay Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-sm shadow-lg dark:shadow-[0_2px_32px_0_rgba(0,209,255,0.20)] max-w-3xl w-full px-6 py-5 text-sm max-h-[90vh] overflow-auto border border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <SearchResult
          categories={categories || []}
          search={searchKey}
          exactMatch={exactMatch || []}
          zipcode={zipCode}
          location={locationInfo}
          fetchError={error?.message || null}
        />
      </div>
    </div>
    </>
  );
}