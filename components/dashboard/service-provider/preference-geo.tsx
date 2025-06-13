'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SelectWorkArea() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCity = searchParams.get('location'); // changed from location to city

  const [points, setPoints] = useState<[number, number][]>([]);

  useEffect(() => {
    if (selectedCity) {
      const fetchPoints = async () => {
        try {
          const res = await fetch(`/api/points?city=${encodeURIComponent(selectedCity)}`);
          if (res.ok) {
            const data = await res.json();
            setPoints(data.points);
          } else {
            console.error('Failed to fetch points:', await res.text());
          }
        } catch (error) {
          console.error('Error fetching points:', error);
        }
      };

      fetchPoints();
    }
  }, [selectedCity]);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 max-w-7xl mx-auto">
      {/* Left Info Card */}
      <Card className="w-full md:w-1/2 dark:border-gray-700 dark:bg-gray-800">
        <CardContent className="space-y-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Selected City</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            You have selected the following city based on the URL parameter.
          </p>

          {selectedCity && (
            <div className="border p-3 rounded-lg dark:border-gray-600">
              <h3 className="font-medium text-gray-800 dark:text-gray-100">{selectedCity}</h3>
              <p>Total points: {points.length}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map */}
      <div className="w-full md:w-1/2 h-[500px] rounded-lg overflow-hidden">
        <MapContainer
          center={points.length > 0 ? points[0] : [40.7128, -74.006]} // default to NYC coords
          zoom={12}
          className="h-full w-full z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          {points.map((pos, idx) => (
            <Marker key={idx} position={pos}>
              <Popup>{`Point #${idx + 1}`}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-6 right-6 flex gap-4">
        <Button
          onClick={() => router.back()}
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Back
        </Button>
        <Button
          onClick={() => router.push('/professional/daytime')}
          className="bg-[#0077B6] text-white hover:bg-[#005f91]"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
