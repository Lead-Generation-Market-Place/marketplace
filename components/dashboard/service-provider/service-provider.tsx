"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { GetAllServicesWithHierarchy, GetAllLocations } from "@/actions/services/findServices";
import { insertServicesAction } from "@/actions/services/pro_services";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgressBar } from "@/components/ui/Progressbar";

const ONBOARDING_STEPS = [
  { id: 1, name: 'Services' },
  { id: 2, name: 'Contact' },
  { id: 3, name: 'Profile' },
  { id: 4, name: 'Reviews' },
  { id: 5, name: 'Preferences' },
];

const formSchema = z.object({
  category: z.string().min(1, "Please select a category to continue."),
  subCategory: z.string().min(1, "Please select a subcategory to continue."),
  services: z.array(z.number()).min(1, "Please select at least one service."),
  location: z.string().min(1, "Please select a location to continue."),
});

type FormData = z.infer<typeof formSchema>;

const MAX_DISPLAY_SERVICES = 2;

interface Service {
  id: number;
  name: string;
}

const SearchServices = () => {
  const [currentStep] = useState(1);

  const [serviceHierarchy, setServiceHierarchy] = useState<Record<string, Record<string, Service[]>>>({});
  const [locations, setLocations] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors, isSubmitted } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      category: "",
      subCategory: "",
      services: [],
      location: "",
    },
  });

  const selected = watch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [hierarchy, locations] = await Promise.all([
          GetAllServicesWithHierarchy(),
          GetAllLocations(),
        ]);
        if (hierarchy && typeof hierarchy === 'object') {
          setServiceHierarchy(hierarchy);
        } else {
          toast.error("Service data format is incorrect");
        }
        if (Array.isArray(locations)) {
          setLocations(locations);
        } else {
          toast.error("Location data format is incorrect");
        }
      } catch {
        toast.error("Failed to load service data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const categories = Object.keys(serviceHierarchy);
  const subCategories = selected.category ? Object.keys(serviceHierarchy[selected.category] || {}) : [];
  const services = selected.subCategory ? (serviceHierarchy[selected.category]?.[selected.subCategory] || []) : [];

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("service_ids", data.services.join(","));
      await insertServicesAction(formData);
      const query = new URLSearchParams();
      query.append("services", data.services.join(","));
      query.append("location", data.location);
      router.push(`/onboarding/social?${query.toString()}`);
    } catch {
      toast.error("Failed to save services");
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (serviceId: number) => {
    const currentServices = selected.services || [];
    let updatedServices;
    if (currentServices.includes(serviceId)) {
      updatedServices = currentServices.filter(id => id !== serviceId);
    } else {
      updatedServices = [...currentServices, serviceId];
    }
    setValue("services", updatedServices);
    trigger("services");
  };

  const displayServicesText = () => {
    if (selected.services.length === 0) return "Select services...";
    const selectedServiceObjects = services.filter(service => selected.services.includes(service.id));
    const displayed = selectedServiceObjects.slice(0, MAX_DISPLAY_SERVICES).map(s => s.name);
    const remaining = selected.services.length - MAX_DISPLAY_SERVICES;
    return (
      <>
        {displayed.join(", ")}
        {remaining > 0 && <span className="text-gray-500 dark:text-gray-400"> +{remaining} more</span>}
      </>
    );
  };

  return (
    <div>
      <ProgressBar
        currentStep={currentStep}
        totalSteps={ONBOARDING_STEPS.length}
        steps={ONBOARDING_STEPS}
        className="mb-2"
      />
      <div className="py-4 mx-auto p-6 bg-white dark:bg-gray-900 dark:border-gray-700 ">
        <h2 className="text-xl font-semibold text-[#0077B6] dark:text-[#90e0ef] mb-2">Sign up as a Professional</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Connect with top Customers in your area</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                {...register("category")}
                onChange={(e) => {
                  setValue("category", e.target.value);
                  trigger("category");
                  setValue("subCategory", "");
                  trigger("subCategory");
                  setValue("services", []);
                  trigger("services");
                }}
                className="w-full text-xs p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded focus:ring-1 focus:ring-[#0077B6] focus:border-[#0077B6]"
                disabled={loading}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {isSubmitted && errors.category && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.category.message}</p>}
            </div>

            {/* Subcategory Selector */}
            {subCategories.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Subcategory</label>
                <select
                  {...register("subCategory")}
                  onChange={(e) => {
                    setValue("subCategory", e.target.value);
                    trigger("subCategory");
                    setValue("services", []);
                    trigger("services");
                  }}
                  className="w-full text-xs p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded focus:ring-1 focus:ring-[#0077B6] focus:border-[#0077B6]"
                  disabled={loading}
                >
                  <option value="">Select subcategory</option>
                  {subCategories.map(subCategory => (
                    <option key={subCategory} value={subCategory}>{subCategory}</option>
                  ))}
                </select>
                {isSubmitted && errors.subCategory && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.subCategory.message}</p>}
              </div>
            )}

            {/* Services Multi-select */}
            {services.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Services</label>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`w-full text-xs p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded text-left flex justify-between items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  <span className="truncate">{displayServicesText()}</span>
                  <svg className={`w-4 h-4 text-[#0077B6] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg max-h-60 overflow-auto" onMouseLeave={() => setDropdownOpen(false)}>
                    {selected.services.length > 0 && (
                      <div onClick={() => { setValue("services", []); trigger("services"); }} className="p-2 text-xs cursor-pointer text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear all
                      </div>
                    )}
                    {services.map(service => (
                      <div key={service.id} onClick={() => toggleService(service.id)} className={`p-2 text-xs cursor-pointer flex items-center ${selected.services.includes(service.id) ? 'bg-[#0077B6]/10 text-[#0077B6] font-medium dark:bg-[#0077B6]/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <span className="flex-grow">{service.name}</span>
                        {selected.services.includes(service.id) && (
                          <svg className="w-3 h-3 text-[#0077B6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {isSubmitted && errors.services && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.services.message}</p>}
              </div>
            )}

            {/* Location Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <select
                {...register("location")}
                onChange={(e) => {
                  setValue("location", e.target.value);
                  trigger("location");
                }}
                className="w-full text-xs p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded focus:ring-1 focus:ring-[#0077B6] focus:border-[#0077B6]"
                disabled={loading}
              >
                <option value="">Select location</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              {isSubmitted && errors.location && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.location.message}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-xs font-medium rounded transition-colors ${loading ? 'bg-[#0077B6]/70 dark:bg-[#0077B6]/50 cursor-not-allowed' : 'bg-[#0077B6] hover:bg-[#005f8e] text-white'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center text-white">
                <Loader2 className="animate-spin mr-2 h-3 w-3 text-white" />
                Finding...
              </span>
            ) : 'Sign up as a Pro'}
          </button>
        </form>

        {/* Support Info */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-600 dark:text-gray-300">
            <p className="font-medium text-[#0077B6] dark:text-[#90e0ef]">Need assistance?</p>
            <p className="mt-1">Call us at: <a href="tel:+12028304424" className="text-[#0077B6] hover:underline">+1 (202) 830-4424</a></p>
            <p className="mt-1">Email: <a href="mailto:support@yelpax.com" className="text-[#0077B6] hover:underline">support@yelpax.com</a></p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default SearchServices;
