import Image from "next/image";
import Link from "next/link";

type PromoCardProps = {
  promotion: {
    id: string;
    description: string;
    imageUrl: string;
    categories: {
      id: string;
      name: string;
    };
  };
  index: number;
};


const bgColors = [
  'bg-red-500 dark:bg-red-900',
  'bg-amber-500 dark:bg-amber-900',
  'bg-emerald-500 dark:bg-emerald-900',
  'bg-blue-500 dark:bg-blue-900',
  'bg-purple-500 dark:bg-purple-900',
  'bg-pink-500 dark:bg-pink-900',
  'bg-yellow-500 dark:bg-yellow-900',
  'bg-sky-500 dark:bg-sky-900',
  'bg-indigo-500 dark:bg-indigo-900',
  'bg-green-500 dark:bg-green-900',
];


export const PromoCard = ({ promotion, index }: PromoCardProps) => {
  const bgClass = bgColors[index % bgColors.length];

  return (
    <div
      className={`flex flex-row items-stretch rounded-lg shadow-md overflow-hidden transition-colors duration-300 min-w-0 ${bgClass}`}
    >
      {/* Text Content */}
      <div className="flex-2 min-w-0 flex flex-col justify-center py-2 pl-2">
        <p className="text-xs sm:text-sm text-yellow-300 font-semibold truncate">
          #PromoToday
        </p>
        <h2 className="font-semibold my-2 md:my-3 text-white text-base md:text-md line-clamp-2">
          {promotion.categories?.name || "Untitled Category"}
        </h2>
        <p className="text-white text-xs line-clamp-2">
          {promotion.description}
        </p>
        <Link
          href="#"
          className="w-fit text-center inline-block bg-black backdrop-blur-xl text-white dark:text-white px-4 py-2 mt-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-300 hover:bg-gray-800 dark:hover:bg-gray-900/50"
        >
          Explore More
        </Link>
      </div>

      {/* Image */}
      <div className="flex-1 items-center justify-center flex-shrink-0">
        <Image
          src={promotion.imageUrl}
          width={100}
          height={100}
          alt={promotion.categories.name}
          className="sm:w-28 sm:h-36 md:w-32 md:h-40 object-cover transition-all duration-300"
        />
      </div>
    </div>
  );
};




