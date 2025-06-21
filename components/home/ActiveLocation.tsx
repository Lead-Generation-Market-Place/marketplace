'use client';

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

const ActiveLocation = () => {
  return (
    <div className="p-4 ">
      <div className="w-full">
        <MapView />
      </div>
    </div>
  );
};

export default ActiveLocation;
