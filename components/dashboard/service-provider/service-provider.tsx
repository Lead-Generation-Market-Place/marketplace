"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { SearchServiceSuggestions, SearchLocationSuggestions } from "@/actions/service";
import { useRouter } from "next/navigation";

const SearchServices = () => {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  const [serviceSuggestions, setServiceSuggestions] = useState<string[]>([]);
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [ignoreServiceSuggestionFetch, setIgnoreServiceSuggestionFetch] = useState(false);

  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [ignoreLocationSuggestionFetch, setIgnoreLocationSuggestionFetch] = useState(false);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (ignoreServiceSuggestionFetch) return;
    const timeout = setTimeout(async () => {
      if (service.length > 1) {
        try {
          const res = await SearchServiceSuggestions(service);
          setServiceSuggestions(res?.length ? res : []);
          setShowServiceSuggestions(true);
        } catch {
          setServiceSuggestions([]);
          setShowServiceSuggestions(true);
        }
      } else {
        setServiceSuggestions([]);
        setShowServiceSuggestions(false);
      }
    }, 150);
    return () => clearTimeout(timeout);
  }, [service, ignoreServiceSuggestionFetch]);

  useEffect(() => {
    if (ignoreLocationSuggestionFetch) return;
    const timeout = setTimeout(async () => {
      if (location.length > 1) {
        try {
          const res = await SearchLocationSuggestions(location);
          setLocationSuggestions(res?.length ? res : []);
          setShowLocationSuggestions(true);
        } catch {
          setLocationSuggestions([]);
          setShowLocationSuggestions(true);
        }
      } else {
        setLocationSuggestions([]);
        setShowLocationSuggestions(false);
      }
    }, 150);
    return () => clearTimeout(timeout);
  }, [location, ignoreLocationSuggestionFetch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!service || !location) {
      toast.error("Please enter both service and location.");
      return;
    }
    startTransition(() => {
      router.push(
        `/professional/services?service=${encodeURIComponent(service)}&location=${encodeURIComponent(location)}`
      );
    });
  };

const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setService(e.target.value);
  if (ignoreServiceSuggestionFetch && e.target.value !== service) {
    setIgnoreServiceSuggestionFetch(false);
  }
};

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    if (ignoreLocationSuggestionFetch) setIgnoreLocationSuggestionFetch(false);
  };

  const handleServiceSuggestionClick = (text: string) => {
    setService(text);
    setShowServiceSuggestions(false);
    setIgnoreServiceSuggestionFetch(true);
  };

  const handleLocationSuggestionClick = (text: string) => {
    setLocation(text);
    setShowLocationSuggestions(false);
    setIgnoreLocationSuggestionFetch(true);
  };

  return (
    <div className="flex justify-center px-4">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl p-8 w-full max-w-2xl mt-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Find Services in Your Area</h1>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-300 text-base">
          Join <span className="font-semibold text-black dark:text-white">30,000+</span> users searching daily.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 relative" autoComplete="off">
          {/* Service Input */}
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              What service do you provide?
            </label>
            <div className="relative">
              <Search className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                id="service"
                name="service"
                type="text"
                value={service}
                onChange={handleServiceChange}
                placeholder="e.g. Home Cleaning"
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:ring-2 focus:ring-[#0077B6] focus:outline-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              {showServiceSuggestions && (
                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-[4px] max-h-48 overflow-y-auto">
                  {serviceSuggestions.length > 0 ? (
                    serviceSuggestions.map((item, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
                        onClick={() => handleServiceSuggestionClick(item)}
                      >
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 italic select-none">
                      No suggestions
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Location Input */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your location
            </label>
            <div className="relative">
              <MapPin className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                id="location"
                name="location"
                type="text"
                value={location}
                onChange={handleLocationChange}
                placeholder="e.g. New York"
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:ring-2 focus:ring-[#0077B6] focus:outline-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              {showLocationSuggestions && (
                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-[4px] max-h-48 overflow-y-auto">
                  {locationSuggestions.length > 0 ? (
                    locationSuggestions.map((item, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
                        onClick={() => handleLocationSuggestionClick(item)}
                      >
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 italic select-none">
                      No suggestions
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isPending}
              className={`w-full flex justify-center items-center gap-2 py-3 rounded-md font-semibold text-sm text-white transition ${
                isPending
                  ? "bg-[#0077B6]/70 cursor-not-allowed"
                  : "bg-[#0077B6] hover:bg-[#005f8e]"
              }`}
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Search Services
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Need help? Call{" "}
          <a
            href="tel:+12028304424"
            className="text-[#0077B6] font-medium hover:underline"
          >
            +1 (202) 830-4424
          </a>{" "}
          or{" "}
          <a href="#" className="text-[#0077B6] font-medium hover:underline">
            request a call
          </a>
        </div>
      </div>
    </div>
  );
};

export default SearchServices;
