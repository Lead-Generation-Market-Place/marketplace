import React, { Suspense } from 'react';
import { SendReviews } from '@/actions/reviews/send-reviews';

const ReviewRequestClient = React.lazy(() => import('./ReviewRequestClient'));

const SkeletonLoader = () => (
  <div role="status" className="w-full max-w-4xl mx-auto p-6">
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="flex space-x-4">
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded flex-1"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded flex-1"></div>
      </div>
    </div>
  </div>
);

export default async function Page() {
  const data = await SendReviews();

  const normalizedData: {
    userId: string | null;
    username: string | null;
    imageUrl: string | null;
    status: 'success' | 'error';
    message?: string;
  } = {
    userId: data?.userId ?? null,
    username: data?.username ?? null,
    imageUrl: data?.imageUrl ?? null,
    status: data?.status === 'success' ? 'success' : 'error',
    message: data?.message ?? undefined,
  };

  return (
    <main className="dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Suspense fallback={<SkeletonLoader />}>
        <ReviewRequestClient serverData={normalizedData} />
      </Suspense>
    </main>
  );
}
