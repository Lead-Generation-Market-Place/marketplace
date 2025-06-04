"use client";

import React, { Suspense, FC } from "react";
import { useTheme } from "next-themes";

const SearchServices = React.lazy(() => import("@/components/dashboard/service-provider/service-provider"));

const SkeletonLoader: FC = () => (
  <div role="status" aria-live="polite" className="w-full max-w-4xl mx-auto p-6">
    {/* Example Skeleton Cards */}
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
  const { resolvedTheme } = useTheme();

  return (
    <main
      className={`p-2 transition-colors duration-300 ${
        resolvedTheme === "dark" ? "bg-gray-900 text-white" : " text-black"
      }`}
    >
      <Suspense fallback={<SkeletonLoader />}>
        <SearchServices />
      </Suspense>
    </main>
  );
};

export default ParentComponent;
