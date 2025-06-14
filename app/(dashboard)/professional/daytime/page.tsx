"use client";

import React, { Suspense, FC, useMemo } from "react";
import { saveAvailability } from "./action";
import { useSearchParams } from "next/navigation";

const Daytime = React.lazy(() => import("@/components/dashboard/service-provider/daytime"));

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

const DaytimePage: FC = () => {
  const searchParams = useSearchParams();
  const businessName = searchParams.get("businessName") || "";
  const location = searchParams.get("location") || "";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  const services = useMemo(() => {
    try {
      const raw = searchParams.get("services");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [searchParams]);

  return (
    <main className="dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Suspense fallback={<SkeletonLoader />}>
        <Daytime
          saveAvailability={saveAvailability}
          businessName={businessName}
          location={location}
          email={email}
          phone={phone}
          services={services}
        />
      </Suspense>
    </main>
  );
};

export default DaytimePage;
