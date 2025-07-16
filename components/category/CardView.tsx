"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Service {
  id: string;
  name: string;
  description: string;
  sub_categories_id: string;
  service_image_url: string | null;
  public_url?: string | null;
}

interface SubCategory {
  id: string;
  name: string;
}

interface CardViewProps {
  subcategories: SubCategory[];
  selectedSubcategory: SubCategory | null;
}

export default function CardView({
  subcategories,
  selectedSubcategory,
}: CardViewProps) {
  const [groupedServices, setGroupedServices] = useState<
    Record<string, Service[]>
  >({});
  const [loading, setLoading] = useState(false);

  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const fetchAllServices = async () => {
      setLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("services")
        .select("*");

      if (error) {
        console.error("Fetch error:", error);
        setLoading(false);
        return;
      }

      // Load public URLs
      const servicesWithUrls = await Promise.all(
        (data || []).map(async (service) => {
          if (service.service_image_url) {
            const { data: publicUrlData } = supabase.storage
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

      // Group by subcategory id
      const grouped: Record<string, Service[]> = {};
      servicesWithUrls.forEach((s) => {
        if (!grouped[s.sub_categories_id]) grouped[s.sub_categories_id] = [];
        grouped[s.sub_categories_id].push(s);
      });

      setGroupedServices(grouped);
      setLoading(false);
    };

    fetchAllServices();
  }, []);

  useEffect(() => {
    if (selectedSubcategory?.id && refs.current[selectedSubcategory.id]) {
      refs.current[selectedSubcategory.id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedSubcategory]);

  if (loading) {
    return <div className="text-gray-600 dark:text-gray-300">Loading services...</div>;
  }

  return (
    <div>
      {subcategories.map((sub) => (
        <div
          key={sub.id}
          ref={(el) => {
            refs.current[sub.id] = el;
          }}

          className="mb-6"
        >
          <h2 className="text-lg font-semibold mb-4 capitalize text-gray-800 dark:text-white">
            {sub.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(groupedServices[sub.id] || []).map((service) => (
              <div
                key={service.id}
                className="border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 transition-colors duration-300"
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
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
