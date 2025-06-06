const Statistics = () => {
  return (
    <div className="bg-sky-500 p-8 w-full lg:h-80 xl:80 md:h-85 sm:90 my-20 py-10">
        <div className="text-center p-10 text-white">
            <h2 className="text-2xl font-bold ">1 Billion +</h2>
            <p className="text-xs">Leads Generated On US-Connector</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-white my-5">
            <div className="text-center">
                <h2 className="text-lg font-semibold">110,00 +</h2>
                <p className="text-xs">Business Partners</p>
            </div>
            <div className="text-center">
                <h2 className="text-lg font-semibold">100+ Countries</h2>
                <p className="text-xs">US-Connector Users</p>
            </div>
            <div className="text-center">
                <h2 className="text-lg font-semibold">450,000 +</h2>
                <p className="text-xs">Crafty Professionals</p>
            </div>
        </div>

    </div>
  );
}
export default Statistics;