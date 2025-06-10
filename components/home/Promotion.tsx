import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const promotionData = [
  {
    bg: "bg-[#00B4D8]",
    img: "/professionals/pro3.png",
  },
  {
    bg: "bg-[#F45D01]",
    img: "/professionals/pro1.png",
  },
  {
    bg: "bg-teal-500",
    img: "/professionals/pro2.png",
  },
];

const Promotion = () => {
  return (
    <div className="bg-gray-100 pt-10 pb-15">
        <div className="w-full max-w-6xl mx-auto px-2">
      <h2 className="text-xl font-semibold py-1">Promotion for Today</h2>
      <div className="relative">
        <Carousel>
          <CarouselContent>
            {promotionData.map((promo, idx) => (
              <CarouselItem
                key={idx}
                className="md:basis-2/3 lg:basis-1/3">
                <div key={idx} className={`${promo.bg} flex flex-row items-center rounded`}>
                    <div className="p-2">
                        <p className="text-sm text-[#FFD700]">#PromoToday</p>
                        <h2 className="font-semibold my-3 text-white">
                            Work with our best service providers
                        </h2>
                        <Link
                            href="#"
                            className="bg-black text-white px-4 py-2 rounded-sm text-sm">
                            Book Now
                        </Link>
                    </div>
                    <div className="pr-2">
                    <Image
                        src={promo.img}
                        width={100}
                        height={100}
                        alt="Professional Image"
                        className="w-30 h-40 object-cover"/>
                    </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious  />
          <CarouselNext  />
        </Carousel>
      </div>
    </div>
    </div>
  );
};

export default Promotion;