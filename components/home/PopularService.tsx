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
  description: string;
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
      } else {
        setServices(data);
      }
    }
    fetchPopularServices();
  }, [supabase]);

 

  return (
    <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="mx-2            
      sm:mx-4          
      md:mx-6          
      lg:mx-8          
      xl:mx-12         
      2xl:mx-16">
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
                    "
                  >
                    <div className="flex flex-col items-center w-full h-40 border border-gray-200 dark:border-gray-700 rounded pt-2 shadow bg-white dark:bg-gray-800 transition-colors duration-300">
                      <div>
                        <Image
                          src={`/services/serv${idx + 1}.png`}
                          width={100}
                          height={100}
                          alt="Professional Image"
                          className="w-20 h-25 object-cover"
                        />
                      </div>
                      <p className="font-semibold text-sm capitalize mb-2 text-gray-900 dark:text-white text-center transition-colors duration-300">
                        {service.name}
                      </p>
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem className="basis-[70vw] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-2">
                  <div className="flex items-center justify-center h-32 w-full bg-white dark:bg-gray-800 transition-colors duration-300 rounded shadow">
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