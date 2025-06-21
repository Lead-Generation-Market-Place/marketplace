"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function Reviews() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-[50vh] dark:bg-gray-900 px-2 sm:px-4 md:px-8">
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <div className="mb-2">
          <h1 className="text-base sm:text-lg md:text-2xl font-semibold text-gray-900 dark:text-white">
            These reviews say it better!
          </h1>
        </div>

        <CarouselContent className="overflow-visible">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-full"
            >
              <div className="bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-start rounded-md shadow-xl p-4 sm:p-6 md:p-8 transition-all max-w-full">
                <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                  &quot;I didn&apos;t realize how many professionals Yelpax had on it.
                  You type in things like house cleaning, you get a ton of pros.
                  You type in landscaping, you get a ton of pros. You name it. It&apos;s there.&quot;
                </p>
                <p className="text-xs sm:text-sm md:text-sm font-medium text-gray-800 dark:text-gray-200">
                  — Esmatullah Hashimi
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex justify-center gap-2 mt-5">
          <CarouselPrevious className="relative" />
          <CarouselNext className="relative" />
        </div>
      </Carousel>
    </div>
  )
}

export default Reviews
