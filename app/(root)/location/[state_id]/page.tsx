export default async function Page({ params }: { params: Promise<{ state_id: string }> }) {
  const { state_id } = await params;

  console.log(state_id);

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-700 animate-ring">Coming Soon...</h1>
        <p className="text-sm">Under Development !</p>
      </div>
    </div>
  );
}