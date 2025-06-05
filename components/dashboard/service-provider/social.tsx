'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; // Adjust path to your Supabase client

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the JSON string for services from query and parse it
  const servicesString = searchParams.get('services') || '[]';
  const location = searchParams.get('location') || '';

  const [services, setServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [enableTextMessages, setEnableTextMessages] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Parse the services string safely
    try {
      const parsedServices = JSON.parse(servicesString);
      // Clean up any unwanted whitespace/newlines
      setServices(parsedServices.map((s: string) => s.trim()));
    } catch (e) {
      console.error('Error parsing services:', e);
      setServices([]);
    }
  }, [servicesString]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setEmail(data.user.email || '');
      } else {
        console.error("Error fetching user:", error);
      }
    };
    fetchUserEmail();
  }, []);

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setLoading(true);

  const formData = new FormData(event.currentTarget);
  const phone = formData.get('phone') as string;

  // Construct params
  const params = new URLSearchParams();

  if (email) params.set('email', email);
  if (phone) params.set('phone', phone);
  if (services.length > 0) params.set('services', JSON.stringify(services));
  if (location) params.set('location', location);

  // Navigate to new route with query string
  router.push(`/professional/onboarding?${params.toString()}`);

  setLoading(false);
};


  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-2">
      <div className="text-center space-y-2 ">
        <h1 className="text-2xl text-[#0077B6] tracking-tight">
          New customers are waiting.
        </h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          There were{' '}
          <span className="font-semibold">1,353</span>{' '}
          jobs on Us Connecter last month in your area.
        </p>
      </div>

      {/* Email Input (Disabled) */}
      <div className="max-w-lg mx-auto">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Email address
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-[4px] dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm2 0v12h12V4H4Zm2 2h8v2H6V6Zm0 4h8v2H6v-2Z" />
            </svg>
          </span>
          <input
            type="email"
            id="email"
            name="email"
            value={email || ''}
            disabled
            readOnly
            className="rounded-r-[4px] bg-gray-100 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="you@example.com"
          />
        </div>
      </div>

      {/* Phone Input */}
      <div className="max-w-lg mx-auto">
        <label
          htmlFor="phone"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Phone number
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-[4px] dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.41 12.41 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.41 12.41 0 0 0 2.81.7 2 2 0 0 1 1.72 2z" />
            </svg>
          </span>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="rounded-r-[4px] bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      {/* Enable Text Messages */}
      <div className="flex items-start text-sm text-gray-600 mb-6 max-w-lg mx-auto">
        <input
          type="checkbox"
          id="enableTexts"
          checked={enableTextMessages}
          onChange={() => setEnableTextMessages(!enableTextMessages)}
          className="mr-2 mt-1 rounded focus:ring-0 focus:outline-none"
        />
        <label htmlFor="enableTexts" className="cursor-pointer">
          Enable text messages. By checking this box, you authorize U.S Connector to send you automated
          text messages. Opt out anytime.
          <a href="#" className="text-[#0077B6] underline ml-1">Terms apply</a>.
        </label>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 text-center mb-6 max-w-sm mx-auto">
        By clicking Continue, you agree to the{' '}
        <a href="#" className="text-[#0077B6] underline">Terms of Use</a> and{' '}
        <a href="#" className="text-[#0077B6] underline">Privacy Policy</a>.
      </p>

      {/* Buttons */}
      <div className="flex justify-between pt-4 max-w-sm mx-auto">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-[#0077B6] transition focus:outline-none focus:ring-2 focus:ring-[#0096C7] rounded"
        >
          &larr; Back
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-[#0077B6] text-white px-5 py-2 rounded-[4px] text-sm font-semibold hover:bg-[#0096C7] transition focus:outline-none focus:ring-2 focus:ring-[#0096C7]"
          disabled={loading}
        >
          {loading ? "Continue..." : 'Continue'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
