"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Service = {
  id: number;
  name: string;
  service_image_url: string;
  description: string;
  imageUrl?: string;
};

export default function PopularService() {
  const router = useRouter();
  const [services, setServices] = useState<Service[] | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPopularServices() {
      const { data, error } = await supabase.from("services").select("*").limit(8);

      if (error) {
        console.error("Error fetching services:", error);
        return;
      }

      const servicesWithImageUrl = data.map((service) => {
        const { data: urlData } = supabase.storage
          .from("serviceslogos")
          .getPublicUrl(service.service_image_url);

        return {
          ...service,
          imageUrl: urlData.publicUrl,
        };
      });

      setServices(servicesWithImageUrl);
    }

    fetchPopularServices();
  }, [supabase]);

  const loadQuestion = (service: Service) => {
    const serviceId = service.id;
    router.push(`/service?serviceId=${serviceId}`);
  };

  return (
    <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-12 2xl:mx-16">
        <div className="flex justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
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

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services?.length ? (
            services.map((service, idx) => (
              <div
                key={idx}
                className="relative w-full h-48 sm:h-40 md:h-44 lg:h-52 rounded-lg overflow-hidden shadow-md dark:shadow-gray-700 cursor-pointer group"
                onClick={() => loadQuestion(service)}
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 text-white pointer-events-none drop-shadow-lg">
                      <h3 className="text-xl font-bold drop-shadow-md capitalize">
                        {service.name}
                      </h3>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
                    <p className="text-gray-500 dark:text-gray-300">Loading image...</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center h-40 bg-white dark:bg-gray-800 rounded shadow">
              <p className="text-gray-500 dark:text-gray-300">Loading services...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
