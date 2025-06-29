import ServiceCard from "../elements/ServiceCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const NewService = () => {
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
   <div className="bg-gray-100 dark:bg-gray-900 pt-10 pb-16 transition-colors duration-300">
     <div className="
        mx-2            
      sm:mx-4          
      md:mx-6          
      lg:mx-8          
      xl:mx-12         
      2xl:mx-16
      ">
      <h2 className="text-xl font-semibold py-1 text-gray-900 dark:text-white transition-colors duration-300">
        New Services of Yelpax
      </h2>
      <div className="relative">
        <Carousel>
          <CarouselContent>
            {services.map((service, idx) => (
              <CarouselItem
                key={idx}
                className="
                  basis-[90vw]
                  sm:basis-2/3
                  md:basis-1/2
                  lg:basis-1/3
                  flex-shrink-0
                  flex-grow
                  min-w-0
                "
              >
                <ServiceCard service={service} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
   </div>
  );
};
export default NewService;