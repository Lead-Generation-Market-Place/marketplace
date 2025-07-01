import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Service = {
  id: number;
  name: string;
  service_image_url: string;
  description?: string;
  imageUrl?: string;  // You can generate this on server or client, explained below
};

interface YouMayLikeProps {
  data: Service[];
}

const YouMayLike = ({ data }: YouMayLikeProps) => {
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
            {data.length > 0 ? (
              data.map((service, idx) => (
                <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                  <div>
                    {/* Image */}
                    <div>
                      <Image
                        src={service.imageUrl?? ''}
                        alt={service.name}
                        className="w-full h-48 object-cover rounded"
                        width={400}
                        height={300}
                        unoptimized={true}
                      />
                    </div>
                    {/* Name */}
                    <div>
                      <h1 className="text-lg py-2 font-semibold">{service.name}</h1>
                    </div>
                  </div>
                </CarouselItem>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No services available.
              </p>
            )}
          </CarouselContent>
          <CarouselNext className="absolute top-[40%] right-[-2%]" />
          <CarouselPrevious className="absolute top-[40%] left-[-2%]" />
        </Carousel>
      </div>
    </div>
  );
};

export default YouMayLike;
