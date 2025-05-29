"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, MapPin, Search } from "lucide-react";
import {
  ProfessionalServices,
  SearchServiceSuggestions,
  SearchLocationSuggestions,
} from "@/actions/service";
import { useRouter } from "next/navigation";

interface ServiceResult {
  id: string;
  name: string;
  location?: string;
}

const SearchServices = () => {
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  const [serviceSuggestions, setServiceSuggestions] = useState<string[]>([]);
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [ignoreServiceSuggestionFetch, setIgnoreServiceSuggestionFetch] =
    useState(false);

  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [ignoreLocationSuggestionFetch, setIgnoreLocationSuggestionFetch] =
    useState(false);

  const [results, setResults] = useState<ServiceResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);

  useEffect(() => {
    if (ignoreServiceSuggestionFetch) return;
    const timeout = setTimeout(async () => {
      if (service.length > 1) {
        try {
          const res = await SearchServiceSuggestions(service);
          setServiceSuggestions(res || []);
          setShowServiceSuggestions(true);
        } catch {
          setServiceSuggestions([]);
          setShowServiceSuggestions(false);
        }
      } else {
        setServiceSuggestions([]);
        setShowServiceSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [service, ignoreServiceSuggestionFetch]);

  useEffect(() => {
    if (ignoreLocationSuggestionFetch) return;
    const timeout = setTimeout(async () => {
      if (location.length > 1) {
        try {
          const res = await SearchLocationSuggestions(location);
          setLocationSuggestions(res || []);
          setShowLocationSuggestions(true);
        } catch {
          setLocationSuggestions([]);
          setShowLocationSuggestions(false);
        }
      } else {
        setLocationSuggestions([]);
        setShowLocationSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [location, ignoreLocationSuggestionFetch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSearched(false);

    const formData = new FormData();
    formData.append("service", service);
    formData.append("location", location);

    try {
      const result = await ProfessionalServices(formData);
      setSearched(true);

      if (result.status === "success") {
        if (!Array.isArray(result.data) || result.data.length === 0) {
          toast.error("No services found for your search.");
          setResults([]);
        } else {
          setResults(result.data);
          setCurrentStage(2);

          // Redirect here
          router.push("/professional/services");
        }
      } else {
        toast.error("Search Failed", {
          description: result.message || "Something went wrong.",
        });
        setResults([]);
      }
    } catch {
      toast.error("Search Failed", {
        description: "Something went wrong.",
      });
      setResults([]);
    }

    setLoading(false);
    setShowServiceSuggestions(false);
    setShowLocationSuggestions(false);
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setService(e.target.value);
    if (ignoreServiceSuggestionFetch) setIgnoreServiceSuggestionFetch(false);
    setResults([]);
    setSearched(false);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    if (ignoreLocationSuggestionFetch) setIgnoreLocationSuggestionFetch(false);
    setResults([]);
    setSearched(false);
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

  if (currentStage !== 1) return null;

  return (
    <div className="flex justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mt-4">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Find Services in Your Area
        </h1>
        <p className="mt-2 text-center text-gray-600 text-base">
          Join <span className="font-semibold text-black">30,000+</span> users
          searching daily.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 relative">
          <div>
            <label
              htmlFor="service"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
                autoComplete="off"
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-[4px] focus:ring-2 focus:ring-[#0077B6] focus:outline-none text-sm"
              />
              {showServiceSuggestions &&
                serviceSuggestions.length > 0 &&
                !serviceSuggestions.includes(service) && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-[4px] max-h-48 overflow-y-auto">
                    {serviceSuggestions.map((item, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50"
                        onClick={() => handleServiceSuggestionClick(item)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
                autoComplete="off"
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-[4px] focus:ring-2 focus:ring-[#0077B6] focus:outline-none text-sm"
              />
              {showLocationSuggestions &&
                locationSuggestions.length > 0 &&
                !locationSuggestions.includes(location) && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-[4px] max-h-48 overflow-y-auto">
                    {locationSuggestions.map((item, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50"
                        onClick={() => handleLocationSuggestionClick(item)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 py-3 rounded-md font-semibold text-sm text-white transition ${
                loading
                  ? "bg-[#0077B6]/70 cursor-not-allowed"
                  : "bg-[#0077B6] hover:bg-[#005f8e]"
              }`}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Search
            </button>
          </div>
        </form>

        <div className="mt-8">
          {results.length > 0 && (
            <ul className="space-y-4 mt-4">
              {results.map((res) => (
                <li
                  key={res.id}
                  className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {res.name}
                  </h3>
                  <p className="text-sm text-gray-600">{res.location}</p>
                </li>
              ))}
            </ul>
          )}

          {searched && results.length === 0 && (
            <p className="mt-4 text-center text-red-600 font-semibold">
              No services found matching your search criteria.
            </p>
          )}
        </div>

        <div className="pt-6 text-center text-sm text-gray-500">
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
