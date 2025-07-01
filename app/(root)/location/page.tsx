// app/location/states/page.tsx
import { createClient } from '@/utils/supabase/server';
import LazyStateList from '@/components/home/StateList';

export default async function StatesPage() {
  const supabase = await createClient();
  const { data: states, error } = await supabase.from('state').select('*');

  if (error) {
    console.error('Error fetching states:', error);
    return <div>Failed to load states.</div>;
  }

  const items = states?.map((state) => ({
    id: state.id,
    name: state.name,
    link: `/location/${state.id}`,
  })) || [];

  return <LazyStateList items={items} />;
}
