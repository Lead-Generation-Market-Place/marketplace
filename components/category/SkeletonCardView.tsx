"use client";

export default function SkeletonCardView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 dark:bg-gray-700 rounded-md p-4 shadow-sm space-y-3"
        >
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-500 rounded w-full" />
        </div>
      ))}
    </div>
  );
}
