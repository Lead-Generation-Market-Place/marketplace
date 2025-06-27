import { createClient } from '@/utils/supabase/server';
import ListGrid from '@/components/elements/ListGrid';

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
    link: `/states/${state.id}`,
  })) || [];

  return (
    <ListGrid
      items={items}
      title="States on Yelpax"
      breadcrumb="Yelpax States"
      breadcrumbHref="/"
    />
  );
}
