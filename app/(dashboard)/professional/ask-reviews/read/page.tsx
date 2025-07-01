import React, { Suspense } from "react";
import { RedReviews } from "@/actions/reviews/read-reviews";

const ReviewDisplayClient = React.lazy(() => import("./ReviewDisplay"));

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

export default async function ReviewsSetup() {
  const result = await RedReviews();

  // Normalize data with fallbacks to avoid undefined/null issues
  const normalizedData: {
    status: "success" | "error";
    message?: string;
    userId: string | null;
    averageRating: number;
    totalReviews: number;
    ratingPercent: number;
  } = {
    status: result.status === "success" ? "success" : "error",
    message: result.status === "error" ? result.message : undefined,
    userId: result.status === "success" ? result.userId : null,
    averageRating: result.status === "success" ? result.averageRating : 0,
    totalReviews: result.status === "success" ? result.totalReviews : 0,
    ratingPercent: result.status === "success" ? result.ratingPercent : 0,
  };

  return (
    <main className="dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {normalizedData.status === "error" ? (
        <div className="p-4 bg-red-100 text-red-800 rounded">
          Error loading reviews: {normalizedData.message}
        </div>
      ) : (
        <Suspense fallback={<SkeletonLoader />}>
          <ReviewDisplayClient
            userId={normalizedData.userId}
            averageRating={normalizedData.averageRating}
            totalReviews={normalizedData.totalReviews}
            ratingPercent={normalizedData.ratingPercent}
          />
        </Suspense>
      )}
    </main>
  );
}
