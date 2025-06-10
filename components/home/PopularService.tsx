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
  // Specify the type for Embla Carousel instance, or use 'unknown' if you're not sure
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
    <div className="py-20 border">
      <div className="w-full max-w-6xl mx-auto px-2">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold py-1">
            Services people love in{" "}
            <span className="text-sky-500">Your Area</span>
          </h2>
          <Link
            href="#"
            className="underline hover:text-sky-500 text-xs font-500"
          >
            All Services
          </Link>
        </div>
        <div>
          <Carousel ref={carouselRef}>
            <CarouselContent>
              {services?.length ? (
                services.map((service, idx) => (
                  <CarouselItem key={idx} className="basis-55">
                    <div className="flex flex-col items-center w-50 h-40 border border-gray-200 rounded pt-2 shadow bg-white">
                      <div>
                        <Image
                          src={`/services/serv${idx + 1}.png`}
                          width={100}
                          height={100}
                          alt="Professional Image"
                          className="w-20 h-25 object-cover"
                        />
                      </div>
                      <p className="font-semibold text-sm capitalize mb-2 text-center">
                        {service.name}
                      </p>
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem className="basis-55">
                  <div className="flex items-center justify-center h-32 w-full">
                    <p>Loading services...</p>
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