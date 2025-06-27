

type Props = {
  params: {
    state_id: string;
    city_id: string;
  };
};


export default async function ServicesPage({ params }: Props) {
 console.log(params);

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <h1 className="font-bold text-gray-500 animate-pulse">Services Comming soon...</h1>
    </div>
  );
}
