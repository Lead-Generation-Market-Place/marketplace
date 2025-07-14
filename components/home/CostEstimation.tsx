import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CircleDollarSign } from "lucide-react";

const CostEstimation = () => {
  const services = [
    {
      image: "/images/image1.jpg",
      serviceName: "Service Name 1",
      rating: 4.9,
      reviews: 868,
      professional: "Professional Name 1",
      priceFrom: 200,
      priceTo: 50,
    },
    {
      image: "/images/image2.jpg",
      serviceName: "Service Name 2",
      rating: 4.9,
      reviews: 868,
      professional: "Professional Name 2",
      priceFrom: 200,
      priceTo: 50,
    },
    {
      image: "/images/image3.jpg",
      serviceName: "Service Name 3",
      rating: 4.9,
      reviews: 868,
      professional: "Professional Name 3",
      priceFrom: 200,
      priceTo: 50,
    },
    {
      image: "/images/image4.jpg",
      serviceName: "Service Name 4",
      rating: 4.9,
      reviews: 868,
      professional: "Professional Name 4",
      priceFrom: 200,
      priceTo: 50,
    },
  ];

    return (
    <div
      className="
      bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
      transition-colors duration-300 py-5 mt-5"
    >
      <div className="mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-12 2xl:mx-16">
        {/* Title */}
        <h2 className="pb-4 text-lg sm:text-xl md:text-2xl font-semibold py-2 text-gray-900 dark:text-white transition-colors duration-300">
          Estimate your service cost for free
        </h2>
        <p className="pb-4 text-gray-500 dark:text-gray-300 text-xs w-[50%]">
            We analyzed millions of real quotes from Yelpax professionals 
            across a wide range of home services to give you a clear 
            picture of what people actually pay.Explore average costs for projects 
            similar to yours before you hire.
        </p>
        {/* Carousel */}
        <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-screen-xl mx-auto"
    >
      <CarouselContent>
        {services.map((service, idx) => (
          <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
            <div className="border border-gray-200 dark:border-gray-800 cursor-pointer transform transition duration-300 hover:scale-105 bg-white dark:bg-gray-900 rounded shadow-md">
              {/* Text Content */}
              <div className="">
                <Image
                  src={service.image}
                  alt="service image"
                  className="w-full h-38 object-cover rounded-t"
                  width={400}
                  height={300}/>
              </div>
              <div className="my-1 p-2">
                <h1 className="text-md font-semibold">{service.serviceName}</h1>
                <div className="flex gap-1 items-center">
                    <CircleDollarSign className="text-sky-500 w-4 h-4" />
                    <p className="text-xs text-gray-500">Avg. price: <strong>$110 - $140</strong></p>
                </div>
              </div>
            </div>
          </CarouselItem>
       ))}

      </CarouselContent>
      <CarouselPrevious className="absolute top-1/2 -left-4 sm:-left-6" />
      <CarouselNext className="absolute top-1/2 -right-4 sm:-right-6" />
    </Carousel>
       <div className="pt-10">
        <button className="text-sm bg-sky-500 px-4 py-2 text-white font-semibold rounded">See all cost info</button>
       </div>
        
      </div>
    </div>
  );
};

export default CostEstimation;
