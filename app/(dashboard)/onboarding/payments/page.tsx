"use client";

import React, { Suspense, FC } from "react";

const SearchServices = React.lazy(() => import("@/components/dashboard/service-provider/payments/page"));

const SkeletonLoader: FC = () => (
  <div role="status" aria-live="polite" className="w-full max-w-4xl mx-auto p-6">
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="flex space-x-4">
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded flex-1"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded flex-1"></div>
      </div>
    </div>
  </div>
);

const ParentComponent: FC = () => {
  return (
    <main className="  dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <Suspense fallback={<SkeletonLoader />}>
        <SearchServices />
      </Suspense>
    </main>
  );
};

export default ParentComponent;
