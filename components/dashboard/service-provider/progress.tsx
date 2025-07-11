'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Onboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [queryData, setQueryData] = useState({
    businessName: ''
  });

  useEffect(() => {
    const businessName = searchParams.get('businessName') || '';


    setQueryData({
      businessName,
    });
  }, [searchParams]);

  const buildQueryString = () =>
    new URLSearchParams({
      businessName: queryData.businessName,
    }).toString();

  const handleNext = () => {
    router.push(`/onboarding/ask-reviews?${buildQueryString()}`);
  };

  const handleBack = () => {
    router.push(`/onboarding/business-info?${buildQueryString()}`);
  };

  return (
    <div className="dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col justify-between">
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center text-center">
          <div className="text-left w-full">
            {/* Step 1 - Inactive */}
            <div className="flex items-start space-x-4 opacity-60 mb-6">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold text-gray-500 dark:text-gray-400">
                1
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                  Business name
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Tell us what your business is called.
                </p>
              </div>
            </div>

            {/* Step 2 - Active */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0077B6] text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Add your preferences
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Target the jobs you want by telling us your availability, ideal job types, and work area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back and Next Buttons */}
      <div className="fixed bottom-6 right-6 flex gap-4">
        <button
          onClick={handleBack}
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold px-6 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-[#0077B6] text-white font-semibold px-6 py-2 rounded hover:bg-[#005f91] transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
