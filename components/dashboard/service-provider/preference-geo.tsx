'use client';

import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { center } from '@turf/center';
import L, { Layer } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { Feature, FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { Checkbox } from 'antd';

// Sample data - replace with your actual data
const locationData = {
  'New York': {
    'Manhattan': ['10001', '10002', '10003', '10004', '10005'],
    'Brooklyn': ['11201', '11205', '11206', '11207', '11208'],
    'Queens': ['11354', '11355', '11356', '11357', '11358'],
    'Hudson County': ['07010', '07020', '07030', '07032', '07087']
  },
  'New Jersey': {
    'Jersey City': ['07302', '07304', '07305', '07306', '07307'],
    'Hoboken': ['07030', '07030', '07030', '07030', '07030']
  }
};

const ActiveIcon = new L.DivIcon({
  html: `
    <div class="relative w-4 h-4">
      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
      <span class="relative inline-block w-4 h-4 bg-red-600 rounded-full"></span>
    </div>
  `,
  className: '',
  iconSize: [16, 16],
});

const MapSelection = () => {
  const [geoData, setGeoData] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null);
  const [selectedZips, setSelectedZips] = useState<Record<string, string[]>>({});
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get state from URL
  const urlState = searchParams.get('state') || 'New York';
  const [activeTab, setActiveTab] = useState<'distance' | 'area'>('area');
  const [selectedState, setSelectedState] = useState(urlState);

  useEffect(() => {
    fetch('/us-state.json')
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  // Update selected zips from URL
  useEffect(() => {
    const urlZips = searchParams.get('zips');
    if (urlZips) {
      const zipsArray = urlZips.split(',');
      const groupedZips: Record<string, string[]> = {};
      
      Object.entries(locationData[selectedState as keyof typeof locationData] || {}).forEach(([city, zips]) => {
        groupedZips[city] = zips.filter(zip => zipsArray.includes(zip));
      });
      
      setSelectedZips(groupedZips);
    }
  }, [searchParams, selectedState]);

  const styleFeature = (feature?: Feature<Geometry, GeoJsonProperties>): L.PathOptions => {
    const name = feature?.properties?.name;
    const isSelectedState = name === selectedState;
    
    // Check if any zips in this area are selected
    const city = Object.keys(locationData[selectedState as keyof typeof locationData] || {}).find(
      city => feature?.properties?.name.includes(city)
    );
    const hasSelectedZips = city && selectedZips[city]?.length > 0;

    return {
      fillColor: hasSelectedZips ? '#2563eb' : isSelectedState ? '#0284c7' : '#059669',
      weight: hasSelectedZips ? 2 : 1,
      color: hasSelectedZips ? '#1e40af' : '#fff',
      dashArray: '3',
      fillOpacity: hasSelectedZips ? 0.8 : isSelectedState ? 0.6 : 0.4,
    };
  };

  const onEachFeature = (feature: Feature<Geometry, GeoJsonProperties>, layer: Layer) => {
    const name = feature.properties?.name;
    if (name) {
      layer.bindPopup(`<strong>${name}</strong>`);
    }
  };

  const handleZipChange = (city: string, zip: string, checked: boolean) => {
    setSelectedZips(prev => {
      const newZips = { ...prev };
      if (!newZips[city]) newZips[city] = [];
      
      if (checked) {
        if (!newZips[city].includes(zip)) {
          newZips[city] = [...newZips[city], zip];
        }
      } else {
        newZips[city] = newZips[city].filter(z => z !== zip);
      }
      
      // Update URL
      const allSelectedZips = Object.values(newZips).flat();
      router.push(`?state=${selectedState}&zips=${allSelectedZips.join(',')}`);
      
      return newZips;
    });
  };

  const handleCityToggle = (city: string, checked: boolean) => {
    setSelectedZips(prev => {
      const newZips = { ...prev };
      const allCityZips = locationData[selectedState as keyof typeof locationData][city] || [];
      
      if (checked) {
        newZips[city] = allCityZips;
      } else {
        delete newZips[city];
      }
      
      // Update URL
      const allSelectedZips = Object.values(newZips).flat();
      router.push(`?state=${selectedState}&zips=${allSelectedZips.join(',')}`);
      
      return newZips;
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="p-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('distance')}
            className={`px-4 py-2 rounded-md ${activeTab === 'distance' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
          >
            Select by distance
          </button>
          <button
            onClick={() => setActiveTab('area')}
            className={`px-4 py-2 rounded-md ${activeTab === 'area' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
          >
            Select by area and zip code
          </button>
        </div>

        {activeTab === 'area' && (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Set areas and zip codes where you want to work. This will change any selection by distance you may have made.
            </p>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                State selected: {selectedState}
              </h3>

              <div className="space-y-4">
                {Object.entries(locationData[selectedState as keyof typeof locationData] || {}).map(([city, zips]) => {
                  const selectedCount = selectedZips[city]?.length || 0;
                  const allSelected = selectedCount === zips.length;
                  
                  return (
                    <div key={city} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-medium">{city}, {selectedState}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {selectedCount} of {zips.length} areas selected
                          </span>
                        </div>
                        <button 
                          onClick={() => handleCityToggle(city, !allSelected)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {allSelected ? 'Deselect all' : 'Select all'}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {zips.map(zip => (
                          <div key={zip} className="flex items-center">
                            <Checkbox
                              checked={selectedZips[city]?.includes(zip) || false}
                              onChange={(e) => handleZipChange(city, zip, e.target.checked)}
                              className="text-sm"
                            >
                              {zip}
                            </Checkbox>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[400px]">
        <MapContainer 
          center={[40.7128, -74.0060]} 
          zoom={11} 
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {geoData && <GeoJSON data={geoData} style={styleFeature} onEachFeature={onEachFeature} />}
        </MapContainer>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We embrace our diverse community of pros and customers. Please review our non-discrimination policy.
        </p>
      </div>
    </div>
  );
};

export default MapSelection;