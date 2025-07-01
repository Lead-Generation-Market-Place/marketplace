// app/location/states/LazyStateList.tsx
'use client';

import React, { lazy, Suspense } from 'react';

const ListGrid = lazy(() => import('@/components/elements/ListGrid'));

export default function LazyStateList({ items }: { items: { id: number; name: string; link: string }[] }) {
  return (
    <Suspense fallback={<div className="p-6 text-gray-400">Loading states...</div>}>
      <ListGrid
        items={items}
        title="States on Yelpax"
        breadcrumb="Yelpax States"
        breadcrumbHref="/"
      />
    </Suspense>
  );
}
