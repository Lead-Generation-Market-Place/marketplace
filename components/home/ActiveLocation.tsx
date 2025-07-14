'use client';

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

const ActiveLocation = () => {
  return (
      <div className="w-full p-4">
        <MapView />
      </div>
  );
};

export default ActiveLocation;
