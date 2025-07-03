import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const promotionData = [
  {
    bg: "bg-[#00B4D8] dark:bg-[#023e8a]",
    img: "/professionals/pro3.png",
  },
  {
    bg: "bg-[#F45D01] dark:bg-orange-800",
    img: "/professionals/pro1.png",
  },
  {
    bg: "bg-teal-500 dark:bg-teal-700",
    img: "/professionals/pro2.png",
  },
];

const Promotion = () => {
  return (
    <div
      className="
      bg-white dark:bg-gray-900 
      transition-colors duration-300"
    >
      <div className="mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-12 2xl:mx-16">
        {/* Title */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold py-2 text-gray-900 dark:text-white transition-colors duration-300">
          Promotion for Today
        </h2>
        {/* Carousel */}
        <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-screen-xl mx-auto"
    >
      <CarouselContent>
        {promotionData.map((promo, idx) => (
          <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
            <div
                  className={`
                    ${promo.bg}
                    flex flex-row
                    items-stretch
                    rounded-lg
                    shadow-md
                    overflow-hidden
                    transition-colors
                    duration-300
                    min-w-0
                  `}
                >
                  {/* Text Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center p-3">
                    <p className="text-xs sm:text-sm text-[#FFD700] font-semibold truncate">
                      #PromoToday
                    </p>
                    <h2 className="font-semibold my-2 md:my-3 text-white text-base md:text-lg line-clamp-2">
                      Work with our best service providers
                    </h2>
                    <Link
                      href="#"
                      className="inline-block bg-black dark:bg-gray-100 text-white dark:text-black px-4 py-2 mt-2 rounded-sm text-xs sm:text-sm font-medium transition-colors duration-300 hover:bg-gray-800 dark:hover:bg-gray-200"
                    >
                      Book Now
                    </Link>
                  </div>

                  {/* Image */}
                  <div className="flex items-center justify-center flex-shrink-0">
                    <Image
                      src={promo.img}
                      width={100}
                      height={100}
                      alt="Professional"
                      className="w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 object-cover transition-all duration-300"
                    />
                  </div>
                </div>
          </CarouselItem>
       ))}

      </CarouselContent>
    </Carousel>
        
      </div>
    </div>
  );
};

export default Promotion;
