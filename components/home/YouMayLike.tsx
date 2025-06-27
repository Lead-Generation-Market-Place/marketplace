import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const YouMayLike = () => {
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
      bg-white dark:bg-gray-900 
      transition-colors duration-300 pb-15"
    >
      <div className="mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-12 2xl:mx-16">
        {/* Title */}
        <h2 className="pb-4 text-lg sm:text-xl md:text-2xl font-semibold py-2 text-gray-900 dark:text-white transition-colors duration-300">
          Services You May Like
        </h2>
        {/* Carousel */}
        <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-screen-xl mx-auto relative"
    >
      <CarouselContent>
        {services.map((service, idx) => (
          <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
            <div>
              {/* Text Content */}
              <div className="">
                <Image
                  src={service.image}
                  alt="service image"
                  className="w-full h-48 object-cover rounded"
                  width={400}
                  height={300}/>
              </div>
              <div className="">
                <h1 className="text-lg py-2 font-semibold">{service.serviceName}</h1>
              </div>
            </div>
          </CarouselItem>
       ))}
        
      </CarouselContent>
      <CarouselNext className="absolute top-[40%] right-[-2%]"/>
      <CarouselPrevious className="absolute top-[40%] left-[-2%]"/>
    </Carousel>

        
      </div>
    </div>
  );
};

export default YouMayLike;
