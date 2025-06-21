const Statistics = () => {
  return (
    <div className="">
      <div
        className="
          bg-sky-500 dark:bg-sky-900
          w-full
          transition-colors duration-300
          py-6
          sm:py-5
          md:py-10
          lg:py-16
          xl:py-24
          min-h-[120px]
          sm:min-h-[90px]
          md:min-h-[180px]
          lg:min-h-[260px]
          xl:min-h-[340px]
        "
      >
        <div className="text-center text-white pb-5 md:pb-8 lg:pb-10">
          <h2 className="text-2xl font-bold">1 Billion +</h2>
          <p className="text-xs">Leads Generated On Yelpax</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-white">
          <div className="text-center">
            <h2 className="text-lg font-semibold">110,00 +</h2>
            <p className="text-xs">Business Partners</p>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold">100+ Countries</h2>
            <p className="text-xs">Yelpax Users</p>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold">450,000 +</h2>
            <p className="text-xs">Crafty Professionals</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Statistics;