"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
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
  service_image_url: string; // This is just the filename stored in DB
  description: string;
  imageUrl?: string; // Add this to hold the full public URL
};

export default function PopularService() {
  const [services, setServices] = useState<Service[] | null>(null);
  const supabase = createClient();
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchPopularServices() {
      const { data, error } = await supabase.from("services").select("*");

      if (error) {
        console.error("Error fetching services:", error);
        return;
      }

      // Map services to add public image URL
      const servicesWithImageUrl = data.map((service) => {
        const { data: urlData } = supabase
          .storage
          .from("serviceslogos")  // <-- Replace with your actual bucket name
          .getPublicUrl(service.service_image_url);

        return {
          ...service,
          imageUrl: urlData.publicUrl, // Add the public URL here
        };
      });

      setServices(servicesWithImageUrl);
    }
    fetchPopularServices();
  }, [supabase]);

  return (
    <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div
        className="
          mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-12 2xl:mx-16
        "
      >
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold py-1 text-gray-900 dark:text-white transition-colors duration-300">
            Services people love in{" "}
            <span className="text-sky-500 dark:text-sky-300">Your Area</span>
          </h2>
          <Link
            href="#"
            className="underline hover:text-sky-500 dark:hover:text-sky-300 text-xs font-500 text-gray-700 dark:text-gray-200 transition-colors duration-300"
          >
            All Services
          </Link>
        </div>
        <div>
          <Carousel ref={carouselRef}>
            <CarouselContent>
              {services?.length ? (
              services.map((service, idx) => (
                <CarouselItem
                  key={idx}
                  className="
                    basis-[70vw]
                    sm:basis-1/2
                    md:basis-1/3
                    lg:basis-1/4
                    flex-shrink-0
                    flex-grow
                    min-w-0
                    px-3
                  "
                >
                  <div
                    className="
                      relative
                      w-full
                      h-48 sm:h-40 md:h-44 lg:h-52
                      rounded-lg
                      overflow-hidden
                      shadow-md dark:shadow-gray-700
                      cursor-pointer
                      group
                    "
                  >
                    {service.imageUrl ? (
                      <>
                        <Image
                          src={service.imageUrl}
                          alt={`${service.name} image`}
                          fill
                          className="object-cover brightness-50 transition-transform duration-300 group-hover:scale-105"
                          unoptimized={true}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          priority={idx < 3}
                        />
                        {/* Overlay with text */}
                        <div
                          className="
                            absolute inset-0
                            flex flex-col items-center justify-center
                            text-center
                            px-4
                            text-white
                            pointer-events-none
                            drop-shadow-lg
                          "
                        >
                          <h3 className="text-xl font-bold drop-shadow-md capitalize">
                            {service.name}
                          </h3>
                          {/* <p className="mt-1 text-sm drop-shadow-md line-clamp-3">
                            {service.description || "No description available."}
                          </p> */}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
                        <p className="text-gray-500 dark:text-gray-300">Loading image...</p>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="basis-[70vw] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-3">
                <div
                  className="
                    flex items-center justify-center h-40
                    bg-white dark:bg-gray-800 transition-colors duration-300
                    rounded shadow
                  "
                >
                  <p className="text-gray-500 dark:text-gray-300">Loading services...</p>
                </div>
              </CarouselItem>
            )}


            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
}
