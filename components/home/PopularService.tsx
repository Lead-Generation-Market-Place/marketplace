"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Service = {
  id: number;
  name: string;
  description: string;
};

export default function PopularService() {
  const [services, setServices] = useState<Service[] | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPopularServices() {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .limit(8);

      if (error) {
        console.error("Error fetching services:", error);
      } else {
        setServices(data);
      }
    }

    fetchPopularServices();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen my-10 px-4">
      <div className="mb-6">
        <Image
          src="/service.svg"
          alt="Landing Image"
          width={600}
          height={150}
        />
      </div>

      <h1 className="text-xl font-semibold mb-6 text-center">
        Services people love in{" "}
        <span className="text-[#0077B6]">Your Area</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {services?.map((service) => (
          <div
            key={service.id}
            className="bg-white shadow-sm hover:shadow-md transition w-full p-4 rounded-lg border border-gray-200 flex flex-col justify-center items-center text-center"
          >
            <h2 className="font-semibold text-lg capitalize mb-2">
              {service.name}
            </h2>
            <p className="text-gray-500 text-sm">{service.description}</p>
          </div>
        )) || <p>Loading services...</p>}
      </div>
    </div>
  );
}
