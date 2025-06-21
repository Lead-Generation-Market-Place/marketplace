import Image from "next/image";

const BecomePro = () => {
  return (
    <div className="border-b border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
      <div className="flex flex-col justify-center md:items-end lg:items-end xl:items-end sm:items-start px-4">
        <Image
          src="/business.svg"
          alt="Become a Pro"
          width={240} // equivalent to w-60
          height={200} // approximate for h-50
          className="object-cover" 
        />
      </div>
      <div className="flex flex-col justify-center items-start space-y-5 px-4">
        <h1 className="text-xl font-bold">
            Open for business!
        </h1>
        <p className="text-xs">
            Whatever kind of work you do, we&apos;ll help you find the gigs you want.
        </p>
        <button className="text-sm font-semibold bg-sky-500 text-white px-6 py-2 rounded hover:bg-sky-600 transition">
          Become a Yelpax Pro
        </button>
      </div>
    </div>
  );
};

export default BecomePro;
