"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Review {
  id: number;
  review: string;
  created_at: string;
  users_profiles: {
    username: string;
  };
}


export function Reviews({ data }: { data: Review[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  if (!data || data.length === 0) return null;
  

  return (
    <section className="w-full bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 md:px-8">
      <div className="mx-auto w-full max-w-2xl sm:max-w-3xl md:max-w-4xl">
        <h2 className="text-center text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          These reviews say it better!
        </h2>

        <Carousel
          plugins={[plugin.current]}
          className="relative"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {data.map((item) => (
              <CarouselItem key={item.id} className="w-full">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md p-4 sm:p-6 md:p-8 transition-all w-full">
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    &quot;{item.review}&quot;
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    — {item.users_profiles?.username || "Anonymous"}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute top-[50%] left-[-2%]" />
          <CarouselNext className="absolute top-[50%] right-[-2%]" />
        </Carousel>
      </div>
    </section>
  );
}

export default Reviews;
