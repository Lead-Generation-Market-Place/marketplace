"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Service {
  id: string;
  name: string;
  description: string;
  service_image_url: string | null;
  public_url?: string | null;
}

interface SubCategory {
  id: string;
  name: string;
}

interface CardViewProps {
  selectedSubcategory: SubCategory | null;
}

export default function CardView({ selectedSubcategory }: CardViewProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedSubcategory) {
      setServices([]);
      return;
    }

    setLoading(true);

    const fetchServices = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("sub_categories_id", selectedSubcategory.id);

      if (error) {
        console.error(error);
        setServices([]);
        setLoading(false);
        return;
      }

      const servicesWithUrls = await Promise.all(
        (data || []).map(async (service) => {
          if (service.service_image_url) {
            const { data: publicUrlData } = supabase
              .storage
              .from("serviceslogos")
              .getPublicUrl(service.service_image_url);

            return {
              ...service,
              public_url: publicUrlData?.publicUrl || null,
            };
          }
          return {
            ...service,
            public_url: null,
          };
        })
      );

      setServices(servicesWithUrls);
      setLoading(false);
    };

    fetchServices();
  }, [selectedSubcategory]);

  if (!selectedSubcategory) {
    return <div className="text-gray-600 dark:text-gray-300">Please select a subcategory.</div>;
  }

  if (loading) {
    return <div className="text-gray-600 dark:text-gray-300">Loading services...</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 capitalize text-gray-800 dark:text-white">
        {selectedSubcategory.name}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-600 transition-colors duration-300"
          >
            {service.public_url && (
              <img
                src={service.public_url}
                alt={service.name}
                className="w-full h-30 object-cover rounded-t"
              />
            )}
            <div className="p-2 text-sm">
              <h3 className="font-semibold capitalize text-gray-800 dark:text-gray-100">
                {service.name}
              </h3>
              {/* Optional: Uncomment to show description */}
              {/* <p className="text-gray-600 dark:text-gray-400">{service.description}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
