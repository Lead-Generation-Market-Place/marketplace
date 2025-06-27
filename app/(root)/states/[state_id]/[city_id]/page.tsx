type Props = {
  params: {
    state_id: string;
    city_id: string;
  };
};

export default async function ServicesPage({ params }: Props) {
  const stateId = Number(params.state_id);
  const cityId = Number(params.city_id);

  console.log(`Passed Data State ID: ${stateId}, City ID: ${cityId}`);

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <h1 className="font-bold text-gray-500 animate-pulse">Services Coming soon...</h1>
    </div>
  );
}
