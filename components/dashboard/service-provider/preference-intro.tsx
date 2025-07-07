'use client';

import { ProgressBar } from "@/components/ui/Progressbar";
import { Loader2 } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
const ONBOARDING_STEPS = [
  { id: 1, name: 'Services' },
  { id: 2, name: 'Contact' },
  { id: 3, name: 'Profile' },
  { id: 4, name: 'Reviews' },
  { id: 5, name: 'Preferences' },
];



export default function WorkControlCard() {
  const [currentStep] = useState(5);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Get all query parameters
  const businessName = searchParams.get('businessName') || '';
  const location = searchParams.get('location') || '';
  const email = searchParams.get('email') || '';
  const phone = searchParams.get('phone') || '';
  const services = searchParams.get('services') || '';
  const [isPending, setIsPending] = useState(false);


  // Build query string for Next/Back
  // const URLSearch Params //
  const parsedServices = services
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => !isNaN(n))

  const buildParams = () => {
    
    const params = new URLSearchParams();
    if (businessName) params.set('businessName', businessName);
    if (location) params.set('location', location);
    if (parsedServices.length > 0) params.set('services', parsedServices.join(',')) // ✅ Pass as CSV
    if (email) params.set('email', email);
    if (phone) params.set('phone', phone);
    return params.toString();
  };

  const handleNext = () => {
    setIsPending(true);
    router.push(`/professional/daytime?${buildParams()}`);
  };

  const handleBack = () => {
    router.push(`/professional/ask-reviews?${buildParams()}`);
  };

  return (
    <div>
      <ProgressBar
        currentStep={currentStep}
        totalSteps={ONBOARDING_STEPS.length}
        steps={ONBOARDING_STEPS}
        className="mb-8"
      />
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
      <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white mt-6 w-full py-2 px-5 rounded-[4px]"
        >
          Back
        </button>
        <button type="button" disabled={isPending} onClick={handleNext} className={`mt-6 w-full text-white py-2 px-6 rounded-[4px] transition duration-300 flex items-center justify-center gap-2 ${isPending ? 'bg-[#0077B6]/70 cursor-not-allowed' : 'bg-[#0077B6] hover:bg-[#005f8e]'}`}>{isPending && <Loader2 className="h-4 w-4 animate-spin" />}<span className="whitespace-nowrap">Next</span></button>

      </div>
      </div>
    </div>

  );
}
