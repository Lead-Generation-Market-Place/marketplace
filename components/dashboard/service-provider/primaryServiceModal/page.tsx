'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getServicesByIds } from '@/actions/services/findservicesId';
import { Loader2 } from 'lucide-react';

export default function SelectServices() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState<{ id: number, name: string }[]>([]);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const idsParam = searchParams.get('services');
    if (!idsParam) return;

    const ids = idsParam.split(',').map((id) => parseInt(id.trim())).filter(Boolean);
    getServicesByIds(ids).then((result) => {
      setServices(result);
    });
  }, [searchParams]);

  const router = useRouter();

  const businessName = searchParams.get("businessName");
  const location = searchParams.get("location");
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");
  const timezone = searchParams.get("timezone");

  const handleNext = () => {
    const params = new URLSearchParams({
      businessName: businessName ?? "",
      location: location ?? "",
      email: email ?? "",
      phone: phone ?? "",
      timezone: timezone ?? "",
      services: selectedService?.toString() || "",
    });

    startTransition(() => {
      router.push(`/professional/service_questions?${params.toString()}`);
    })
  };
  
  const handleBack = () => {
    router.back()
  }

  return (
    <div className="flex items-center justify-center text-[13px] bg-white dark:bg-gray-900">
      <div className="grid rounded-[7px] overflow-hidden w-full max-w-4xl dark:border-gray-700">
        {/* Left Section - Service Selection */}
        <div className="p-8 md:p-10 bg-white dark:bg-gray-900">
          <h2 className="text-2xl font-bold text-[#023E8A] dark:text-white mb-3">
            Select your primary service.
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-base mb-5 text-[13px]">
            Choose from our list of professional services to get started.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-[13px] block text-gray-700 dark:text-gray-300 font-semibold text-sm mb-2">
                Available services
              </label>
              <div className="mt-2 space-y-3">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`service-${service.id}`}
                      name="service"
                      value={service.id}
                      checked={selectedService === service.id}
                      onChange={() => setSelectedService(service.id)}
                      className="h-4 w-4 text-[#0077B6] focus:ring-[#0077B6] border-gray-300 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`service-${service.id}`}
                      className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {service.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {selectedService && (
              <div className="mt-4 p-3 bg-[#0077B6]/10 rounded-md border border-[#0077B6]/20">
                <p className="text-sm text-[#0077B6] dark:text-[#0096C7]">
                  You have selected: <span className="font-medium">{services.find(s => s.id === selectedService)?.name}</span>
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
              <button
                onClick={handleBack}
                type="button"
                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white mt-6 w-full text-[13px] py-2 px-5 rounded-[4px]"
              >
                Back
              </button>
              <button
                type="button"
                disabled={isPending || !selectedService}
                onClick={handleNext}
                className={`
                  mt-6 w-full text-white text-[13px] py-2 px-6 rounded-[4px]
                  transition duration-300 flex items-center justify-center gap-2
                  ${isPending ? 'bg-[#0077B6]/70 cursor-not-allowed' : 
                    !selectedService ? 'bg-[#0077B6]/50 cursor-not-allowed' : 'bg-[#0077B6] hover:bg-[#005f8e]'}
                `}
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}