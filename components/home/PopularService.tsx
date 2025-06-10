"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";


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
        .limit(4);

      if (error) {
        console.error("Error fetching services:", error);
      } else {
        setServices(data);
      }
    }

    fetchPopularServices();
  }, []);

  return (
    <div className="my-20 w-full max-w-6xl mx-auto px-2"> 
      <div className="flex justify-between">
          <h2 className="text-lg font-semibold py-1">
            Services people love in{" "}
            <span className="text-sky-500">Your Area</span>
          </h2>
           <Link  href="#" className="underline hover:text-sky-500 text-xs font-500">All Services</Link>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
        {services?.map((service, idx) => (
          // card start
          <div key={idx} className="flex flex-row items-center border border-gray-100 rounded p-2 hover:shadow tranistion-shadow">
              <p className="font-semibold text-sm capitalize">{service.name}</p>
              <div className="">
              <Image
                  src={`/services/serv${idx + 1}.png`} 
                  width={100}
                  height={100}
                  alt="Professional Image"
                  className="w-50 h-40 object-cover flex-1"/>
              </div>
          </div>
          // card end
          
        )) || <p>Loading services...</p>}
      </div>
    </div>
  );
}
