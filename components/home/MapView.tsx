'use client';

import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { center } from '@turf/center';
import L, { Layer } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter } from 'next/navigation';
import {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
} from 'geojson';
import { motion } from 'framer-motion'; // ✅ Import Framer Motion

const activeStates = ['California', 'Texas', 'New York', 'Alabama', 'Wyoming'];

const ActiveIcon = new L.DivIcon({
  html: `<span class="relative flex size-3">
    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
    <svg fill="red" viewBox="0 0 425.963 425.963" stroke="red" xmlns="http://www.w3.org/2000/svg"><g><path d="M213.285,0h-0.608C139.114,0,79.268,59.826,79.268,133.361c0,48.202,21.952,111.817,65.246,189.081 c32.098,57.281,64.646,101.152,64.972,101.588c0.906,1.217,2.334,1.934,3.847,1.934c0.043,0,0.087,0,0.13-0.002 c1.561-0.043,3.002-0.842,3.868-2.143c0.321-0.486,32.637-49.287,64.517-108.976c43.03-80.563,64.848-141.624,64.848-181.482 C346.693,59.825,286.846,0,213.285,0z M274.865,136.62c0,34.124-27.761,61.884-61.885,61.884 c-34.123,0-61.884-27.761-61.884-61.884s27.761-61.884,61.884-61.884C247.104,74.736,274.865,102.497,274.865,136.62z"></path></g></svg>
  </span>`,
  className: '',
  iconSize: [16, 16],
});

const MapView = () => {
  const [geoData, setGeoData] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/us-state.json')
      .then((res) => res.json())
      .then((data: FeatureCollection<Geometry, GeoJsonProperties>) => setGeoData(data));
  }, []);

  const styleFeature = (feature?: Feature<Geometry, GeoJsonProperties>): L.PathOptions => {
    const name = feature?.properties?.name;
    const isActive = !!name && activeStates.includes(name);

    return {
      fillColor: isActive ? 'green' : '#79d2a0',
      weight: 1,
      color: '#ffffff',
      dashArray: '3',
      fillOpacity: 0.6,
    };
  };

  const onEachFeature = (
    feature: Feature<Geometry, GeoJsonProperties>,
    layer: Layer
  ) => {
    const name = feature.properties?.name;
    if (name) {
      layer.bindPopup(`<strong>${name}</strong>`);
    }
  };

  const activeMarkers = () => {
    if (!geoData) return null;

    return geoData.features
      .filter((f) => activeStates.includes(f.properties?.name))
      .map((feature) => {
        const centroid = center(feature);
        const [lng, lat] = centroid.geometry.coordinates;
        const name = feature.properties?.name;

        return (
          <Marker key={name} position={[lat, lng]} icon={ActiveIcon}>
            <Popup autoClose={false} closeOnClick={false}>
              <div className="bg-white dark:bg-gray-800 text-sm text-sky-500 dark:text-sky-300 font-medium">
                {name}
              </div>
            </Popup>
          </Marker>
        );
      });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 px-4 dark:bg-gray-900 transition-colors">
      {/* Left Column - Active States List */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.2 }}
        className="flex-6 w-full md:w-1/3 bg-white dark:bg-gray-800 p-4"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Trending around here</h2>
        <div className="flex flex-wrap items-center justify-start gap-2">
          {activeStates.map((state) => (
            <span
              key={state}
              className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-800 border border-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"
            >
              {state}
            </span>
          ))}
        </div>

        <div className="mt-5 space-y-2">
          <h1 className="text-xl font-semibold">All 50 States</h1>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            No more guesswork or dead ends. With Thumbtack, you&apos;ll always find what you&apos;re
            looking for no matter where you are. From major cities to quiet communities,
            we&apos;ve got trusted pros ready to help in every corner of the country.
          </p>
          <button
            onClick={() => router.push('/location')}
            className="text-xs text-gray-500 hover:text-sky-500"
          >
            View All States
          </button>
        </div>
      </motion.div>

      {/* Right Column - Map */}
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        viewport={{ once: true, amount: 0.2 }}
        className="flex-5 w-full md:w-2/3 overflow-hidden rounded-lg shadow-lg"
      >
        <MapContainer
          center={[37.8, -96]}
          zoom={4}
          style={{ height: '350px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {geoData && (
            <GeoJSON data={geoData} style={styleFeature} onEachFeature={onEachFeature} />
          )}
          {activeMarkers()}
        </MapContainer>
      </motion.div>
    </div>
  );
};

export default MapView;
