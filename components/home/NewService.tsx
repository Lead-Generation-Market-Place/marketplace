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
   <div className="bg-gray-100 pt-10 pb-15">
     <div className="w-full max-w-6xl mx-auto px-2">
      <h2 className="text-xl font-semibold py-1">
        New Services of US-Connector
      </h2>
      <div className="relative">
        <Carousel>
          <CarouselContent>
            {services.map((service, idx) => (
              <CarouselItem
                key={idx}
                className="basis-55"
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