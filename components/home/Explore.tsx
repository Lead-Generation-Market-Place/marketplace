"use client";
import { useState } from "react";
import Image from "next/image";
import { LocateFixed } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  imageUrl?: string;
}

interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  services: Service[];
}

interface ExploreProps {
  data: Category[];
}

const Explore = ({ data }: ExploreProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(data[0]?.id ?? "");
  const categoryObj = data.find((cat) => cat.id === selectedCategoryId);

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-lg sm:text-xl font-semibold py-2 text-gray-900 dark:text-white">
        Explore more projects
      </h2>

      {/* Subcategory buttons */}
      <div className="flex flex-wrap gap-3 sm:gap-4 text-sm font-semibold border-b border-gray-200 dark:border-gray-700">
        {data.map((cat) => (
          <button
            key={cat.id}
            className={`pb-2 transition-colors duration-200 hover:text-sky-500 focus:outline-none ${
              selectedCategoryId === cat.id
                ? "text-sky-500 border-b-2 border-sky-500"
                : "text-gray-800 dark:text-gray-200"
            }`}
            onClick={() => setSelectedCategoryId(cat.id)}
            type="button"
          >
            {cat.name}
          </button>
        ))}
        <Link
        href="/more-services"
        className={`pb-2 transition-colors text-gray-800 dark:text-gray-200 duration-200 hover:text-sky-500 focus:outline-none`}>
            More
        </Link>
      </div>

      {/* Selected Category */}
      <div className="mt-6 flex flex-col gap-4">
        {categoryObj && (
          <>
            {/* Category Banner */}
            {categoryObj.imageUrl && (
              <div className="relative w-full rounded-md overflow-hidden">
                <Image
                  src={categoryObj.imageUrl}
                  alt={categoryObj.name}
                  width={1000}
                  height={240}
                  className="w-full h-38 object-cover brightness-50"
                  unoptimized
                />
                <div className="absolute top-1/3 left-4">
                  {categoryObj.description && (
                    <p className="text-white text-sm sm:text-base font-semibold max-w-md">
                      {categoryObj.description}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-white mt-4">
                    See all {categoryObj.name}
                  </p>
                </div>
              </div>
            )}

            {/* Carousel */}
            {categoryObj.services.length > 0 ? (
              <Carousel
                opts={{ align: "start" }}
                className="w-full max-w-screen-xl mx-auto relative "
              >
                <CarouselContent className="flex justify-center">
                  {categoryObj.services.map((service) => (
                    <CarouselItem
                      key={service.id}
                      className="basis-[90%] sm:basis-1/3 lg:basis-1/3 px-1"
                    >
                      <div className="flex flex-col justify-start bg-white dark:bg-gray-800 rounded overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <Image
                          src={service.imageUrl || "/images/image4.jpg"}
                          width={400}
                          height={200}
                          alt={service.name}
                          className="w-full h-32 object-cover mb-2"
                          unoptimized
                        />
                        <div className="px-2 pb-2 text-start">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 capitalize">
                            {service.name}
                          </p>
                          
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            <LocateFixed className="text-sky-500 inline-block mr-1 w-4 h-4" />
                            See pros near you
                          </span>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 -left-4 sm:-left-6" />
                <CarouselNext className="absolute top-1/2 -right-4 sm:-right-6" /><CarouselPrevious className="absolute top-1/2 -left-4 sm:-left-6" />
                <CarouselNext className="absolute top-1/2 -right-4 sm:-right-6" />
              </Carousel>
            ) : (
              <div className="text-center py-8">
                <h1 className="font-bold text-gray-600 dark:text-gray-200 text-lg sm:text-xl">
                  No Services Yet
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  The services for this category have not been published yet.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;
