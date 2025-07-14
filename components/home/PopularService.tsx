"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Service = {
  id: number;
  name: string;
  service_image_url: string;
  description?: string;
  imageUrl?: string;  // You can generate this on server or client, explained below
};

interface PopularServiceProps {
  data: Service[];
}

export default function PopularService({ data }: PopularServiceProps) {
  const router = useRouter();

  // Optional: If your data does not already include public image URLs, you need to generate them here
  // But better to do it server-side and pass imageUrl already computed

  const loadQuestion = (service: Service) => {
    router.push(`/service?serviceId=${service.id}`);
  };

  return (
    <div className=" bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-12 2xl:mx-16">
       
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-md lg:text-xl md:text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              Services people love in{" "}
              <span className="text-sky-500 dark:text-sky-300">Your Area</span>
            </h2>
            <p className="text-xs py-1 text-gray-600 dark:text-gray-400">
              We&apos;ve gathered the most popular servies People around you are using.
            </p>
          </div>
          <div className="flex flex-row gap-2 justify-center items-center my-2">
            <Link
              href="#"
              className="active:bg-sky-500 active:text-white px-4 py-1 text-xs bg-gray-200 dark:bg-gray-800 hover:bg-sky-500 hover:text-white rounded border border-gray-200 dark:border-gray-800 dark:hover:bg-sky-700 text-gray-800 dark:text-white transition-colors duration-300">
              All Services
            </Link>
          </div>
        
          
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.length ? (
            data.map((service) => (
              // service card
              <div 
              key={service.id} 
              onClick={() => loadQuestion(service)}
              className="transform transition duration-300 hover:scale-110 h-42 w-auto rounded border border-gray-200 dark:border-gray-700 hover:shadow-xl bg-white dark:bg-gray-800 cursor-pointer">
                  <div className="m-2 h-2/3 rounded-lg">
                    {service.imageUrl ? (
                    <>
                      <Image
                      src={service.imageUrl}
                      width={224}
                      height={128}
                      alt={service.name}
                      className="object-cover w-full h-full rounded"/>
                    </>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
                      <p className="text-gray-500 dark:text-gray-300">Loading image...</p>
                    </div>
                  )}
                  </div>
                  <div className="px-5 flex flex-col pb-2">
                      <h2 className="font-semibold text-xs capitalize">{service.name}</h2>
                  </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center h-40 bg-white dark:bg-gray-800 rounded shadow">
              <p className="text-gray-500 dark:text-gray-300">No services found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
