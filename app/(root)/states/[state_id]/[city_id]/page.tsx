export default async function ServicesPage({ params }: { params: { state_id: string; city_id: string } }) {
  console.log(params);

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <h1 className="font-bold text-gray-500 animate-pulse">Services Coming soon...</h1>
    </div>
  );
}
