
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PromoCard } from "./PromoCard";

interface PromotionType {
  id: string;
  description: string;
  imageUrl: string;
  categories: {
    id: string;
    name: string;
  };
}




const Promotion: React.FC<{ data: PromotionType[] }> = ({ data }) => {
 
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-12 2xl:mx-16">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold py-2 text-gray-900 dark:text-white transition-colors duration-300">
          Promotion for Today
        </h2>

        <Carousel opts={{ align: "start" }} className="w-full max-w-screen-xl mx-auto relative">
          <CarouselContent>
            {data.map((promotion, index) => (
              <CarouselItem key={promotion.id} className="md:basis-1/2 lg:basis-1/3">
                <PromoCard promotion={promotion} index={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute top-[50%] left-[-2%]" />
          <CarouselNext className="absolute top-[50%] right-[-2%]" />
        </Carousel>
      </div>
    </div>
  );
};

export default Promotion;

