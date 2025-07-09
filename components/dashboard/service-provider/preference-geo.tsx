"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { GoogleMap, LoadScript, Marker, Polygon } from "@react-google-maps/api";

interface City {
  id: number;
  zip: string;
  lat: number | null;
  lng: number | null;
  city: string | null;
  state_name: string | null;
  polygon?: google.maps.LatLngLiteral[]; // Added for area highlighting
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 34.5553,
  lng: 69.2075,
};


// Modern expand/collapse icons using SVG
const ExpandIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const CollapseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

const Map = () => {
 const API = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const params = useSearchParams();
  const location = params.get("location") ?? "";
  const [darkMode, setDarkMode] = React.useState(false);

  const [cities, setCities] = React.useState<City[]>([]);
  const [selectedZipIds, setSelectedZipIds] = React.useState<Set<number>>(new Set());
  const [expandedCities, setExpandedCities] = React.useState<Set<string>>(new Set());

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Fetch cities when location changes
  React.useEffect(() => {
    if (!location) return;

    const fetchZipCodes = async () => {
      try {
        const response = await fetch(`/api/location?state=${encodeURIComponent(location)}`);
        const result = await response.json();

        if (result.success && result.data) {
          // Add polygon data for each city (this would come from your API)
          const citiesWithPolygons = result.data.map((city: City) => ({
            ...city,
            // In a real app, you'd get this polygon data from your API
            polygon: city.lat && city.lng ? generateDummyPolygon(city.lat, city.lng) : undefined
          }));
          setCities(citiesWithPolygons);
        } else {
          toast.error(result.error || "Failed to fetch data");
        }
      } catch (err) {
        toast.error(`Error: ${(err as Error).message}`);
      }
    };
    fetchZipCodes();
  }, [location]);

  // Generate a simple square polygon around a point for demo purposes
  const generateDummyPolygon = (lat: number, lng: number): google.maps.LatLngLiteral[] => {
    const size = 0.01; // Adjust this for polygon size
    return [
      { lat: lat - size, lng: lng - size },
      { lat: lat - size, lng: lng + size },
      { lat: lat + size, lng: lng + size },
      { lat: lat + size, lng: lng - size },
    ];
  };

  // Handle checkbox toggling
  const handleCheckbox = (city: City, checked: boolean) => {
    setSelectedZipIds((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(city.id);
      } else {
        newSet.delete(city.id);
      }
      return newSet;
    });
  };

  // Toggle city expansion
  const toggleCity = (cityName: string) => {
    setExpandedCities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cityName)) {
        newSet.delete(cityName);
      } else {
        newSet.add(cityName);
      }
      return newSet;
    });
  };

  // Select all zip codes in a city
  const selectAllInCity = (cityName: string, select: boolean) => {
    setSelectedZipIds((prev) => {
      const newSet = new Set(prev);
      const cityZips = cities.filter(c => c.city === cityName);
      
      cityZips.forEach(zip => {
        if (select) {
          newSet.add(zip.id);
        } else {
          newSet.delete(zip.id);
        }
      });
      
      return newSet;
    });
  };

  // Compute map center
  const center = React.useMemo(() => {
    const selectedCities = cities.filter((c) => selectedZipIds.has(c.id) && c.lat && c.lng);
    if (selectedCities.length > 0) {
      return { lat: selectedCities[0].lat!, lng: selectedCities[0].lng! };
    }
    return defaultCenter;
  }, [selectedZipIds, cities]);

  // Group cities by city name for sidebar
  const grouped = React.useMemo(() => {
    return cities.reduce((acc, city) => {
      const group = city.city || "Unknown City";
      if (!acc[group]) acc[group] = [];
      acc[group].push(city);
      return acc;
    }, {} as Record<string, City[]>);
  }, [cities]);

  // Check if all zips in a city are selected
  const isAllSelected = (cityName: string) => {
    const cityZips = grouped[cityName] || [];
    return cityZips.length > 0 && cityZips.every(zip => selectedZipIds.has(zip.id));
  };

  return (
    <div className={`flex w-full gap-4 h-[464px] ${darkMode ? 'dark' : ''}`}>
      {/* Dark mode toggle */}
      <button 
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      {/* Sidebar - Scrollable Cities List */}
      <div className="w-1/3 flex flex-col">
        <h2 className="text-sm font-semibold mb-3 p-2 bg-white dark:bg-gray-800 dark:text-white">
          Select Cities & Zip Codes
        </h2>
        <div className="overflow-y-auto flex-1 bg-white dark:bg-gray-800 p-2">
          {Object.entries(grouped).map(([cityName, zips]) => {
            const isExpanded = expandedCities.has(cityName);
            const allSelected = isAllSelected(cityName);
            const zipCount = zips.length;
            const hasSelected = zips.some(zip => selectedZipIds.has(zip.id));
            
            return (
              <div 
                key={cityName} 
                className={`space-y-1 border rounded p-2 mb-2 ${
                  allSelected || hasSelected 
                    ? 'border-blue-300 bg-blue-50 dark:bg-blue-900 dark:border-blue-700' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="font-medium text-gray-700 dark:text-gray-300 text-xs flex items-center cursor-pointer"
                    onClick={() => toggleCity(cityName)}
                  >
                    <span className="mr-2">
                      {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                    </span>
                    <span>
                      {cityName} <span className="text-gray-500 dark:text-gray-400">({zipCount})</span>
                    </span>
                  </div>
                  <label className="inline-flex items-center space-x-1 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-2.5 w-2.5 text-[#0077B6] dark:text-[#0077B6] border-gray-300 dark:border-gray-600 rounded focus:ring-[#0077B6] dark:focus:ring-[#0077B6] dark:bg-gray-700"
                      checked={allSelected}
                      onChange={(e) => selectAllInCity(cityName, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="dark:text-gray-300">All</span>
                  </label>
                </div>
                
                {isExpanded && (
                  <div className="flex flex-wrap gap-1.5 pl-4">
                    {zips.map((zip) => (
                      <label
                        key={`${zip.city}-${zip.zip}-${zip.id}`}
                        className={`inline-flex items-center space-x-1 text-xs cursor-pointer select-none rounded px-1.5 py-0.5 border ${
                          selectedZipIds.has(zip.id) 
                            ? 'bg-blue-100 dark:bg-blue-800 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-200' 
                            : 'border-transparent dark:text-gray-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox h-2.5 w-2.5 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700"
                          checked={selectedZipIds.has(zip.id)}
                          onChange={(e) => handleCheckbox(zip, e.target.checked)}
                        />
                        <span>{zip.zip}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Google Map - Fixed Height */}
      <div className="w-2/3 pt-14">
        <LoadScript googleMapsApiKey={API}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={selectedZipIds.size > 0 ? 10 : 5}
            options={{
              styles: darkMode ? [
                // Dark mode map styles
                { elementType: "geometry", stylers: [{ color: "#0077B6" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#0077B6" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#0077B6" }] },
                // ... more dark mode styles
              ] : undefined
            }}
          >
            {/* Render selected markers and polygons */}
            {cities.map((city) => {
              if (city.lat == null || city.lng == null || !selectedZipIds.has(city.id)) return null;

              return (
                <React.Fragment key={city.id}>
                  <Marker
                    position={{ lat: city.lat, lng: city.lng }}
                    icon={{
                      url: darkMode 
                        ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png" 
                        : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                      scaledSize: new window.google.maps.Size(40, 40),
                    }}
                    title={`${city.city} ZIP: ${city.zip}`}
                  />
                  {/* Render polygon if available */}
                  {city.polygon && (
                    <Polygon
                      paths={city.polygon}
                      options={{
                        fillColor: darkMode ? "#0077B6" : "#60a5fa",
                        fillOpacity: 0.4,
                        strokeColor: darkMode ? "#0077B6" : "#2563eb",
                        strokeOpacity: 0.8,
                        strokeWeight: 2
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default Map;