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
  // query for exact match
  const { data: categories, error } = await supabase
  .from('services')
  .select('*');
  
  const {data: exactMatch, error: exactMatchError} = await supabase
  .from('services')
  .select('*')
  .eq('name', inputValue)
  if(error){console.log(exactMatchError);}
  return (
    <>
    <div className="flex">
      <div className="w-[20%] p-2 border border-gray-200">
        <SearchFilter />
      </div>
      <div className="w-[80%] p-2">
        <ProsList />
      </div>
    </div>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div className="bg-white rounded-sm shadow-lg max-w-3xl w-full px-6 py-5 text-sm max-h-[90vh] overflow-auto">
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
