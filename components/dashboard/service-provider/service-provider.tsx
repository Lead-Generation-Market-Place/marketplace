"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { GetAllServicesWithHierarchy, GetAllLocations } from "@/actions/service";
import { useRouter } from "next/navigation";

interface SearchParams {
  services: string[];
  location: string;
  category: string;
  subCategory: string;
}

const MAX_DISPLAY_SERVICES = 2;

const SearchServices = () => {
  const [serviceHierarchy, setServiceHierarchy] = useState<Record<string, Record<string, string[]>>>({});
  const [locations, setLocations] = useState<string[]>([]);
  const [selected, setSelected] = useState<SearchParams>({
    category: "",
    subCategory: "",
    services: [],
    location: ""
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch data on mount
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

  // Close dropdown when clicking outside
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.services.length === 0 && !selected.location) {
      toast.error("Please select at least one service or location");
      return;
    }
    setLoading(true);
    try {
      const query = new URLSearchParams();
      // Use JSON.stringify for array, and parse on the receiving page
      if (selected.services.length > 0) {
        query.append("services", JSON.stringify(selected.services));
      }
      if (selected.location) query.append("location", selected.location);
      if (selected.category) query.append("category", selected.category);
      if (selected.subCategory) query.append("subCategory", selected.subCategory);
      router.push(`/professional/social?${query.toString()}`);
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (service: string) => {
    setSelected(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const displayServicesText = () => {
    if (selected.services.length === 0) return "Select services...";
    
    const displayed = selected.services.slice(0, MAX_DISPLAY_SERVICES);
    const remaining = selected.services.length - MAX_DISPLAY_SERVICES;
    
    return (
      <>
        {displayed.join(", ")}
        {remaining > 0 && <span className="text-gray-500"> +{remaining} more</span>}
      </>
    );
  };

  return (
    <div className="py-4 mx-auto p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold text-[#0077B6] mb-2">Sign up as a Professional</h2>
      <p className="text-sm text-gray-600 mb-6">

        Connect with top Customres in your area

      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selected.category}
              onChange={(e) => setSelected({
                ...selected,
                category: e.target.value,
                subCategory: "",
                services: []
              })}
              className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#0077B6] focus:border-[#0077B6]"
              disabled={loading}
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Subcategory Selector */}
          {subCategories.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Subcategory
              </label>
              <select
                value={selected.subCategory}
                onChange={(e) => setSelected({
                  ...selected,
                  subCategory: e.target.value,
                  services: []
                })}
                className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#0077B6] focus:border-[#0077B6]"
                disabled={loading}
              >
                <option value="">Select subcategory</option>
                {subCategories.map(subCategory => (
                  <option key={subCategory} value={subCategory}>{subCategory}</option>
                ))}
              </select>
            </div>
          )}

          {/* Services Multi-select */}
          {services.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Services
              </label>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-full text-xs p-2 border border-gray-300 rounded text-left flex justify-between items-center ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                <span className="truncate">
                  {displayServicesText()}
                </span>
                <svg 
                  className={`w-4 h-4 text-[#0077B6] transition-transform ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {dropdownOpen && (
                <div 
                  className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  {selected.services.length > 0 && (
                    <div 
                      onClick={() => setSelected(prev => ({...prev, services: []}))}
                      className="p-2 text-xs cursor-pointer text-red-500 hover:bg-gray-100 border-b border-gray-200 flex items-center"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear all
                    </div>
                  )}
                  {services.map(service => (
                    <div
                      key={service}
                      onClick={() => toggleService(service)}
                      className={`p-2 text-xs cursor-pointer flex items-center ${
                        selected.services.includes(service) 
                          ? 'bg-[#0077B6]/10 text-[#0077B6] font-medium' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="flex-grow">{service}</span>
                      {selected.services.includes(service) && (
                        <svg className="w-3 h-3 text-[#0077B6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Location Selector */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              value={selected.location}
              onChange={(e) => setSelected({...selected, location: e.target.value})}
              className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#0077B6] focus:border-[#0077B6]"
              disabled={loading}
            >
              <option value="">Any location</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 text-xs font-medium rounded transition-colors ${
            loading 
              ? 'bg-[#0077B6]/70 cursor-not-allowed'
              : 'bg-[#0077B6] hover:bg-[#005f8e] text-white'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2 h-3 w-3" />
              Signing...
            </span>
          ) : 'Sign up as a Pro'}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <p className="font-medium text-[#0077B6]">Need assistance?</p>
          <p className="mt-1">Call us at: <a href="tel:+12028304424" className="text-[#0077B6] hover:underline">+1 (202) 830-4424</a></p>
          <p className="mt-1">Email: <a href="mailto:support@yelpax.com" className="text-[#0077B6] hover:underline">support@yelpax.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default SearchServices;
