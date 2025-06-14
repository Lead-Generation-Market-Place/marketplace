"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProfessionalServices, GetAllServicesWithHierarchy, GetAllLocations } from "@/actions/service";
import { useRouter } from "next/navigation";

const SearchServices = () => {
  const [categories, setCategories] = useState<{ name: string }[]>([]);
  const [subCategories, setSubCategories] = useState<{ name: string }[]>([]);
  const [services, setServices] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState(""); // category name
  const [selectedSubCategory, setSelectedSubCategory] = useState(""); // subcategory name
  const [selectedService, setSelectedService] = useState("");
  const [location, setLocation] = useState("");
  const [locationsList, setLocationsList] = useState<string[]>([]);

  const [serviceHierarchy, setServiceHierarchy] = useState<Record<string, Record<string, string[]>>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [hierarchy, locations] = await Promise.all([
          GetAllServicesWithHierarchy(),
          GetAllLocations(),
        ]);
        setServiceHierarchy(hierarchy);
        // Use category names
        const cats = Object.keys(hierarchy).map((catName) => ({ name: catName }));
        setCategories(cats);
        setLocationsList(locations);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (selectedCategory && serviceHierarchy[selectedCategory]) {
      // subCategories: [{name}]
      const subs = Object.keys(serviceHierarchy[selectedCategory]).map((subName) => ({ name: subName }));
      setSubCategories(subs);
      setSelectedSubCategory("");
    } else {
      setSubCategories([]);
      setSelectedSubCategory("");
      setServices([]);
      setSelectedService("");
    }
  }, [selectedCategory, serviceHierarchy]);

  useEffect(() => {
    if (selectedCategory && selectedSubCategory && serviceHierarchy[selectedCategory]?.[selectedSubCategory]) {
      setServices(serviceHierarchy[selectedCategory][selectedSubCategory].filter((x) => typeof x === 'string'));
      // Auto-select the first service if available
      if (serviceHierarchy[selectedCategory][selectedSubCategory].length > 0) {
        setSelectedService(serviceHierarchy[selectedCategory][selectedSubCategory][0]);
      } else {
        setSelectedService("");
      }
    } else {
      setServices([]);
      setSelectedService("");
    }
  }, [selectedSubCategory, selectedCategory, serviceHierarchy]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedService && !location) {
      toast.error("Please select a service and/or location.");
      return;
    }

    const formData = new FormData();
    if (selectedService) formData.append("services", selectedService);
    if (location) formData.append("location", location);

    startTransition(async () => {
      const result = await ProfessionalServices(formData);
      if (result.status === "error") {
        toast.error(result.message);
      } else {
        const query = new URLSearchParams();
        if (selectedService) query.append("service", selectedService);
        if (location) query.append("location", location);
        router.push(`/professional/services?${query.toString()}`);
      }
    });
  };

  return (
    <div className="flex justify-center px-4">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl p-8 w-full max-w-2xl mt-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Find Services in Your Area</h1>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-300 text-base">
          Join <span className="font-semibold text-black dark:text-white">30,000+</span> users searching daily.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 relative" autoComplete="off">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:ring-2 focus:ring-[#0077B6] focus:outline-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sub-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subcategory
            </label>
            <select
              id="sub-category"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              disabled={!selectedCategory}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:ring-2 focus:ring-[#0077B6] focus:outline-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select subcategory</option>
              {subCategories.map((sub) => (
                <option key={sub.name} value={sub.name}>{sub.name}</option>
              ))}
            </select>
            {/* Display subcategories below when a category is selected */}
            {selectedCategory && subCategories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {subCategories.map((sub) => (
                  <span
                    key={sub.name}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                      selectedSubCategory === sub.name
                        ? 'bg-[#0077B6] text-white border-[#0077B6]'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                    }`}
                    onClick={() => {
                      if (selectedSubCategory !== sub.name) {
                        setSelectedSubCategory(sub.name);
                      }
                    }}
                    style={{ userSelect: 'none' }}
                  >
                    {sub.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service
            </label>
            <select
              id="service"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              disabled={!selectedSubCategory}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:ring-2 focus:ring-[#0077B6] focus:outline-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select service</option>
              {services.map((srv) => (
                <option key={srv} value={srv}>{srv}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:ring-2 focus:ring-[#0077B6] focus:outline-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select a location</option>
              {locationsList.map((loc, index) => (
                <option key={index} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className={`w-full flex justify-center items-center gap-2 py-3 rounded-md font-semibold text-sm text-white transition ${
                isPending ? "bg-[#0077B6]/70 cursor-not-allowed" : "bg-[#0077B6] hover:bg-[#005f8e]"
              }`}
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Search Services
            </button>
          </div>
        </form>

        <div className="pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Need help? Call {" "}
          <a href="tel:+12028304424" className="text-[#0077B6] font-medium hover:underline">
            +1 (202) 830-4424
          </a>{" "}
          or {" "}
          <a href="#" className="text-[#0077B6] font-medium hover:underline">
            request a call
          </a>
        </div>
      </div>
    </div>
  );
};

export default SearchServices;
