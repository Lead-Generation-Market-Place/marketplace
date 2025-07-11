"use client";
import React, { useRef, useState, useEffect, useCallback, useTransition, useMemo, } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { GoogleMap, useJsApiLoader, Circle, StandaloneSearchBox, } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
import { saveCoordinates } from "@/actions/locations/saveCoordinates";
import { Libraries } from "@react-google-maps/api";
const libraries: Libraries = ["places"];
const containerStyle = {
  width: "100%",
  height: "400px",
};
const TAB_OPTIONS = [
  { label: "Select by Distance", value: "distance" },
  { label: "Advanced", value: "advanced" },
];
const milesToMeters = (miles: number) => miles * 1609.34;
const Map = () => {
  const searchParams = useSearchParams();
  // Memoize search params to prevent unnecessary recalculations
  const { businessName, location, email, phone, timezone, services } = useMemo(() => {
    const servicesParam = searchParams.get("services") || "";
    return {
      businessName: searchParams.get("businessName") ?? "",
      location: searchParams.get("location") ?? "",
      email: searchParams.get("email") ?? "",
      phone: searchParams.get("phone") ?? "",
      timezone: searchParams.get("timezone") ?? "",
      services: servicesParam
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n)),
    };
  }, []);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [activeTab, setActiveTab] = useState("distance");
  const [radiusMiles, setRadiusMiles] = useState(10);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    city?: string;
    state?: string;
    zip?: string;
  } | null>(null);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLoc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCenter(userLoc);
          setSelectedLocation({ ...userLoc });
        },
        () => {
        }
      );
    }
  }, []);

  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const location = place.geometry?.location;
      const addressComponents = place.address_components;

      if (location) {
        const lat = location.lat();
        const lng = location.lng();
        let city = "", state = "", zip = "";

        if (addressComponents) {
          for (const comp of addressComponents) {
            const types = comp.types;
            if (types.includes("locality")) city = comp.long_name;
            if (types.includes("administrative_area_level_1")) state = comp.short_name;
            if (types.includes("postal_code")) zip = comp.long_name;
          }
        }

        setCenter({ lat, lng });
        setSelectedLocation({ lat, lng, city, state, zip });
      }
    }
  };

  const handleNext = async () => {
    if (!selectedLocation) {
      toast.error("Please select your business location first.");
      return;
    }

    try {
      startTransition(async () => {
        const urldata = new URLSearchParams({
          businessName,
          location,
          email,
          phone,
          timezone,
          services: services.join(","),
        });
        console.log("Saving coordinates:", services)
        await saveCoordinates({ ...selectedLocation, radiusMiles, services });
        router.push(`/onboarding/service_questions?${urldata.toString()}`);
      });
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleBack = () => router.back();

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center" style={{ height: 400 }}>
        <Loader2 className="h-6 w-6 animate-spin text-[#0077B6]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-xs font-medium text-center" role="tablist">
          {TAB_OPTIONS.map((tab) => (
            <li className="me-2" key={tab.value}>
              <button
                className={`inline-block p-2.5 border-b-2 rounded-t-lg transition-colors duration-200 ${activeTab === tab.value
                  ? "text-[#0077B6] border-[#0077B6]"
                  : "text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300"
                  }`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Distance Tab */}
      {activeTab === "distance" && (
        <div
          className="rounded-lg bg-white dark:bg-gray-900 flex flex-col md:flex-row gap-4"
          style={{ minHeight: 400 }}
        >
          {/* Left Controls */}
          <div className="flex flex-col gap-3 w-full md:w-1/3 px-4 py-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Select by distance
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Set the max distance from your business location
            </p>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Search Business Location
              </label>
              <StandaloneSearchBox
                onLoad={(ref) => (searchBoxRef.current = ref)}
                onPlacesChanged={onPlacesChanged}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search location..."
                  className="mt-1 block w-full text-[12px] px-4 py-2 border border-gray-400 dark:border-gray-700 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-[#0096C7] focus:border-transparent text-gray-800 dark:text-white dark:bg-gray-800 text-sm"
                />
              </StandaloneSearchBox>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">Distance radius</span>
                <span className="text-xs font-medium text-[#0077B6]">{radiusMiles} miles</span>
              </div>
              <input
                type="range"
                min={1}
                max={300}
                value={radiusMiles}
                onChange={(e) => setRadiusMiles(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg cursor-pointer dark:bg-gray-700"
                style={{ accentColor: "#0077B6" }}
              />
            </div>
          </div>

          {/* Right Map Panel */}
          <div className="relative flex-1">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center ?? { lat: 39.8283, lng: -98.5795 }} // fallback center to continental US if none
              zoom={center ? 6 : 4}
              onLoad={onMapLoad}
            >
              {center && (
                <Circle
                  center={center}
                  radius={milesToMeters(radiusMiles)}
                  options={{
                    fillColor: "#0077B6",
                    fillOpacity: 0.2,
                    strokeColor: "#0077B6",
                    strokeOpacity: 0.8,
                    strokeWeight: 1.5,
                  }}
                />
              )}
            </GoogleMap>
          </div>
        </div>
      )}

      {/* Advanced Tab Placeholder */}
      {activeTab === "advanced" && (
        <div
          className="p-6 rounded-lg bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 flex items-center justify-center"
          style={{ minHeight: 400 }}
        >
          <div className="text-center max-w-xs">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Advanced Filters
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Coming soon: More advanced filtering options for precise location targeting.
            </p>
          </div>
        </div>
      )}

      {/* Footer Controls */}
      <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
        <button
          onClick={handleBack}
          type="button"
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white mt-6 py-2 px-5 rounded-[4px]"
        >
          Back
        </button>
        <button
          type="button"
          disabled={isPending || !selectedLocation}
          onClick={handleNext}
          className={`mt-6 py-2 px-6 rounded-[4px] flex items-center justify-center gap-2 text-white text-[13px] transition duration-300
            ${!selectedLocation || isPending
              ? "bg-[#0077B6]/70 cursor-not-allowed"
              : "bg-[#0077B6] hover:bg-[#005f8e]"
            }`}
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>Next</span>
        </button>
      </div>
    </div>
  );
};

export default Map;
