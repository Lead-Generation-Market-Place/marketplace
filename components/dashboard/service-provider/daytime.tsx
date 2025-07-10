'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ProgressBar } from "@/components/ui/Progressbar";

const defaultSchedule = [
  { dayOfWeek: 0, day: 'Sunday', shifts: [{ openTime: '00:00', closeTime: '00:00', isClosed: true }] },
  { dayOfWeek: 1, day: 'Monday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: false }] },
  { dayOfWeek: 2, day: 'Tuesday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: false }] },
  { dayOfWeek: 3, day: 'Wednesday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: false }] },
  { dayOfWeek: 4, day: 'Thursday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: false }] },
  { dayOfWeek: 5, day: 'Friday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: false }] },
  { dayOfWeek: 6, day: 'Saturday', shifts: [{ openTime: '00:00', closeTime: '00:00', isClosed: true }] },
];

const generateTimeOptions = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

export interface SaveAvailabilityResult {
  status: 'success' | 'error';
  message: string;
  details?: string | null;
}
const ONBOARDING_STEPS = [
  { id: 1, name: 'Services' },
  { id: 2, name: 'Contact' },
  { id: 3, name: 'Profile' },
  { id: 4, name: 'Reviews' },
  { id: 5, name: 'Preferences' },
];
export default function AvailabilityForm({
  saveAvailability,
  businessName,
  location,
  email,
  phone,
  services,

}: {
  saveAvailability: (formData: FormData) => Promise<SaveAvailabilityResult>;
  businessName: string;
  location: string;
  email: string;
  phone: string;
  services: number[];


}) {
  const [selectedOption, setSelectedOption] = useState<'business' | 'string'>('business');
  const [currentStep] = useState(5);

  const [schedule, setSchedule] = useState(defaultSchedule);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleTimeChange = (
    dayIndex: number,
    shiftIndex: number,
    type: 'openTime' | 'closeTime',
    value: string
  ) => {
    setSchedule((prev) => {
      const newSchedule = prev.map((day, i) => {
        if (i !== dayIndex) return day;
        return {
          ...day,
          shifts: day.shifts.map((shift, j) => {
            if (j !== shiftIndex) return shift;
            return {
              ...shift,
              [type]: value,
              isClosed: value !== '00:00' ? false : shift.isClosed,
            };
          }),
        };
      });
      return newSchedule;
    });
  };

  const handleAvailabilityToggle = (dayIndex: number, shiftIndex: number) => {
    setSchedule((prev) => {
      const newSchedule = prev.map((day, i) => {
        if (i !== dayIndex) return day;
        const newDay = { ...day };
        newDay.shifts = day.shifts.map((shift, j) => {
          if (j !== shiftIndex) return shift;
          const isClosed = !shift.isClosed;
          return {
            ...shift,
            isClosed,
            openTime: isClosed ? '00:00' : '09:00',
            closeTime: isClosed ? '00:00' : '17:00',
          };
        });
        return newDay;
      });
      return newSchedule;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.set('availabilityType', selectedOption);
    formData.set('timezone', timezone);
    formData.set('services', JSON.stringify(services));
    formData.set('businessName', businessName);
    formData.set('location', location);
    formData.set('email', email);
    formData.set('phone', phone);

    let finalSchedule = schedule;
    if (selectedOption === 'string') {
      finalSchedule = defaultSchedule.map((day) => ({
        ...day,
        shifts: [{ openTime: '00:00', closeTime: '23:59', isClosed: false }],
      }));
    }

    formData.set('schedule', JSON.stringify(finalSchedule));

    try {
      const result = await saveAvailability(formData);

      if (result.status === 'success') {
        // Build base params
        const params = new URLSearchParams({
          businessName,
          location,
          email,
          phone,
          timezone,
          services: services.join(','), // All services as comma-separated
        });

        if (services.length > 1) {
          // Multiple services – go to service selection modal
          router.push(`/professional/primaryServiceModal?${params.toString()}`);
        } else {
          // Only one service – include serviceId explicitly
          params.set('services', services[0].toString());

          router.push(`/professional/service_questions?${params.toString()}`);
        }
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error: unknown) {
      let message = 'An unexpected error occurred while saving availability.';

      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message: unknown }).message === 'string'
      ) {
        message = (error as { message: string }).message;
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <ProgressBar
        currentStep={currentStep}
        totalSteps={ONBOARDING_STEPS.length}
        steps={ONBOARDING_STEPS}
        className="mb-8"
      />
      <div className="flex items-center justify-center text-[13px] bg-white dark:bg-gray-900">
        <div className="w-full max-w-4xl border border-gray-200 dark:border-gray-700 shadow-sm rounded-[7px] overflow-hidden">
          <form ref={formRef} onSubmit={handleSubmit} className="p-8 md:p-10 bg-white dark:bg-gray-900">
            <h2 className="text-2xl font-bold text-[#023E8A] dark:text-white mb-3">
              Set your availability for <span className="italic">{businessName || 'your business'}</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-[13px] mb-5">
              Customers will only request jobs during the times you set.
            </p>

            <div className="space-y-4">
              {/* Business Hours Option */}
              <div
                className={`border rounded-[4px] cursor-pointer p-4 ${selectedOption === 'business' ? 'border-[#0077B6]' : 'border-gray-300 dark:border-gray-700'
                  }`}
                onClick={() => setSelectedOption('business')}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="radio"
                    checked={selectedOption === 'business'}
                    readOnly
                    className="accent-[#0077B6]"
                  />
                  <span className="font-medium text-gray-900 dark:text-gray-100">Set Business Availability</span>
                </div>

                {selectedOption === 'business' && (
                  <div className="space-y-3">
                    {schedule.map((day, dayIndex) => (
                      <div
                        key={day.dayOfWeek}
                        className="flex items-center gap-4 border-b py-2 last:border-none border-gray-200 dark:border-gray-700"
                      >
                        <label
                          className="flex items-center text-gray-700 dark:text-gray-300 cursor-pointer min-w-[80px]"
                          htmlFor={`closed-${day.dayOfWeek}`}
                        >
                          <input
                            id={`closed-${day.dayOfWeek}`}
                            type="checkbox"
                            checked={day.shifts[0].isClosed === true}
                            onChange={() => handleAvailabilityToggle(dayIndex, 0)}
                            className="mr-2"
                          />
                          Closed
                        </label>

                        <span className="min-w-[80px] text-gray-900 dark:text-gray-100 font-medium">
                          {day.day}
                        </span>

                        {!day.shifts[0].isClosed && (
                          <div className="flex items-center gap-2">
                            <select
                              value={day.shifts[0].openTime}
                              onChange={(e) => handleTimeChange(dayIndex, 0, 'openTime', e.target.value)}
                              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1"
                            >
                              {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>

                            <span className="mx-1 text-gray-500 dark:text-gray-400">to</span>

                            <select
                              value={day.shifts[0].closeTime}
                              onChange={(e) => handleTimeChange(dayIndex, 0, 'closeTime', e.target.value)}
                              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1"
                            >
                              {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available Any Time Option */}
              <div
                className={`border rounded-[4px] cursor-pointer p-4 ${selectedOption === 'string' ? 'border-[#0077B6]' : 'border-gray-300 dark:border-gray-700'
                  }`}
                onClick={() => setSelectedOption('string')}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={selectedOption === 'string'}
                    readOnly
                    className="accent-[#0077B6]"
                  />
                  <span className="font-medium text-gray-900 dark:text-gray-100">Available Any Time</span>
                </div>

                {selectedOption === 'string' && (
                  <p className="mt-4 text-green-600 dark:text-green-400">
                    You will be available 24 hours, every day.
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Navigation Buttons */}
        <div className="fixed bottom-6 right-6 flex gap-4 text-[13px] ">
          <button
            onClick={handleBack}
            type="button"
            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white mt-6 w-full text-[13px] py-2 px-5 rounded-[4px] "
          >
            Back
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => formRef.current?.requestSubmit()}
            className={`
              mt-6 w-full text-white text-[13px] py-2 px-6 rounded-[4px]
              transition duration-300 flex items-center justify-center gap-2
              ${isLoading ? 'bg-[#0077B6]/70 cursor-not-allowed' : 'bg-[#0077B6] hover:bg-[#005f8e]'}
            `}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Next</span>
          </button>
        </div>
      </div>
    </div>

  );
}
