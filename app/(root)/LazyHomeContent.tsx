'use client';

import React, { lazy, Suspense } from 'react';

// Define interfaces
interface PromotionType {
  id: string;
  title: string;
  imageUrl: string;
}

interface ServiceType{
  id: number;
  name: string;
  service_image_url: string;
  description?: string;
  imageUrl?: string;  // You can generate this on server or client, explained below
};
interface Service {
  id: string;
  name: string;
  imageUrl?: string;
}

interface ExploreCategory {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  services: Service[];
}

interface CostEstimate {
  id: string;
  name: string;
  price: number;
}

interface Location {
  id: string;
  city: string;
  region: string;
}

interface Review {
  id: number;
  review: string;
  created_at: string;
  users_profiles: {
    username: string;
  };
}


// Generic component type that accepts data prop
type WithData<T> = React.FC<{ data: T[] }>;

// Lazy components with generic types
const HeroForm = lazy(() => import('@/components/home/HeroForm'));
const Promotion = lazy(() => import('@/components/home/Promotion')) as WithData<PromotionType>;
const PopularService = lazy(() => import('@/components/home/PopularService')) as WithData<ServiceType>;
const YouMayLike = lazy(() => import('@/components/home/YouMayLike')) as WithData<ServiceType>;
const Explore = lazy(() => import('@/components/home/Explore')) as WithData<ExploreCategory>;
const CostEstimation = lazy(() => import('@/components/home/CostEstimation')) as WithData<CostEstimate>;
const ActiveLocation = lazy(() => import('@/components/home/ActiveLocation')) as WithData<Location>;
const Reviews = lazy(() => import('@/components/home/Reviews')) as WithData<Review>;

const MobileApps = lazy(() => import('@/components/home/MobileApps'));
const BecomePro = lazy(() => import('@/components/home/BecomePro'));

const Skeleton = () => (
  <div className="p-6 text-gray-400 animate-pulse">Loading section...</div>
);

interface LazyHomeContentProps {
  promotions: PromotionType[];
  popularServices: ServiceType[];
  youMayLike: ServiceType[];
  explore: ExploreCategory[];
  costEstimates: CostEstimate[];
  locations: Location[];
  reviews: Review[];
}

export default function LazyHomeContent({
  promotions,
  popularServices,
  youMayLike,
  explore,
  costEstimates,
  locations,
  reviews,
}: LazyHomeContentProps) {
  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <HeroForm />
      </Suspense>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Suspense fallback={<Skeleton />}>
          <Promotion data={promotions} />
        </Suspense>

        <Suspense fallback={<Skeleton />}>
          <PopularService data={popularServices} />
        </Suspense>

        <Suspense fallback={<Skeleton />}>
          <YouMayLike data={youMayLike} />
        </Suspense>
      </div>

      <Suspense fallback={<Skeleton />}>
        <MobileApps />
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <Explore data={explore} />
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <CostEstimation data={costEstimates} />
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <ActiveLocation data={locations} />
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <BecomePro />
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <Reviews data={reviews} />
      </Suspense>
    </>
  );
}
