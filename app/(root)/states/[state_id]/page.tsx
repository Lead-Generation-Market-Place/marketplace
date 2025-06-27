

// type Props = {
//   params: {
//     state_id: string;
//   };
// };

// type City = {
//   id: number;
//   name: string;
//   total_population?: number;
// };



export default async function CitiesPage({ params }: { params: { state_id: string; } }) {
  // const supabase = await createClient();
  // const stateId = Number(params.state_id);
  console.log(params)
  // 1. Fetch cities
  // const { data: cities, error } = await supabase.rpc('get_top_cities_by_population', {
  //   state_input: stateId,
  // });

  // if (error) {
  //   console.error('Error fetching cities:', error);
  // }

  // if (error || !cities || cities.length === 0) {
  //   notFound();
  // }

  // // 2. Fetch state name
  // const { data: state, error: stateError } = await supabase
  //   .from('state')
  //   .select('name,code')
  //   .eq('id', stateId)
  //   .single();

  // if (stateError || !state) {
  //   console.error('Error fetching state name:', stateError);
  //   notFound();
  // }

  // // 3. Prepare items
  // const items = cities.map((city: City) => ({
  //   id: city.id,
  //   name: city.name,
  //   link: `/states/${params.state_id}/${city.id}`,
  // }));

  // 4. Render
  return (
    // <ListGrid
    //   items={items}
    //   title={`${state.name}'s Top Cities`}
    //   breadcrumb={state.name}
    //   breadcrumbHref={`/states/${params.state_id}`}
    // />
    <div className="flex items-center justify-center h-[80vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-700 animate-ring">Coming Soon...</h1>
        <p className="text-sm">Under Development !</p>
      </div>
    </div>
  );
}
