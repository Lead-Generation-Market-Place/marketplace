"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import "leaflet/dist/leaflet.css";

// Custom CSS for popup text size
const popupStyle = `
  .leaflet-popup-content-wrapper {
    font-size: 13px !important;
  }
  .leaflet-popup-content {
    margin: 5px 10px !important;
  }
`;

// Default marker icon (needed because Leaflet default icon may not load in some bundlers)
const defaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Highlighted marker icon (e.g., red)
const highlightIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  shadowSize: [41, 41],
});

interface City {
  id: number;
  zip: string;
  lat: number | null;
  lng: number | null;
  city: string | null;
  state_name: string | null;
}

const Map = () => {
  const params = useSearchParams();
  const location = params.get("location") ?? "";
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedZipIds, setSelectedZipIds] = useState<Set<number>>(new Set());

  // Insert popup style once
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = popupStyle;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !location) return;

    const fetchZipCodes = async () => {
      try {
        const response = await fetch(
          `/api/location?state=${encodeURIComponent(location)}`
        );
        const result = await response.json();

        if (result.success && result.data) {
          setCities(result.data);
        } else {
          toast.error(result.error || "Failed to fetch data");
        }
      } catch (err) {
        toast.error(`Error: ${(err as Error).message}`);
      }
    };

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([37.8, -96], 4);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);
    }

    // Create a layer group for dynamic markers if not created yet
    if (!markersLayer.current && mapInstance.current) {
      markersLayer.current = L.layerGroup().addTo(mapInstance.current);
    } else if (markersLayer.current) {
      markersLayer.current.clearLayers();
    }

    fetchZipCodes();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [location]);

  // Update markers when selectedZipIds or cities change
  useEffect(() => {
    if (!mapInstance.current || !markersLayer.current) return;

    markersLayer.current.clearLayers();

    const bounds = L.latLngBounds([]);

    cities.forEach((city) => {
      if (selectedZipIds.has(city.id) && city.lat && city.lng) {
        // Use highlighted icon for selected
        const marker = L.marker([city.lat, city.lng], {
          icon: highlightIcon,
        });
        marker.bindPopup(`
          <strong>${city.city || "Unknown City"}</strong><br/>
          ZIP: ${city.zip}<br/>
          State: ${city.state_name || "Unknown State"}
        `);
        marker.addTo(markersLayer.current!);
        bounds.extend([city.lat, city.lng]);
      } else if (city.lat && city.lng) {
        // Show non-selected markers but lighter color and smaller opacity
        const marker = L.marker([city.lat, city.lng], {
          icon: defaultIcon,
          opacity: 0.4,
        });
        marker.bindPopup(`
          <strong>${city.city || "Unknown City"}</strong><br/>
          ZIP: ${city.zip}<br/>
          State: ${city.state_name || "Unknown State"}
        `);
        marker.addTo(markersLayer.current!);
      }
    });

    if (selectedZipIds.size > 0 && bounds.isValid()) {
      mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [selectedZipIds, cities]);

  // Group cities by name
  const grouped = cities.reduce((acc, city) => {
    const group = city.city || "Unknown City";
    if (!acc[group]) acc[group] = [];
    acc[group].push(city);
    return acc;
  }, {} as Record<string, City[]>);

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

  return (
    <div className="flex w-full h-[500px] gap-4">
      {/* Sidebar */}
      <div className="w-1/3 overflow-y-auto border p-4 rounded-md shadow bg-white">
        <h2 className="text-xl font-semibold mb-3">Select Cities & Zip Codes</h2>
        {Object.entries(grouped).map(([cityName, zips]) => (
          <div key={cityName} className="mb-3">
            <h3 className="font-semibold text-gray-700 mb-1">{cityName}</h3>
            <div className="space-y-1">
              {zips.map((zip) => (
                <label
                  key={`${zip.city}-${zip.zip}-${zip.id}`}
                  className="flex items-center space-x-2 text-sm cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                    checked={selectedZipIds.has(zip.id)}
                    onChange={(e) => handleCheckbox(zip, e.target.checked)}
                  />
                  <span>{zip.zip}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="w-2/3 border rounded-md shadow">
        <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
      </div>
    </div>
  );
};

export default Map;
