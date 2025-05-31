'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const services = searchParams.getAll('service'); // support multiple services
  const location = searchParams.get('location') || '';

  useEffect(() => {
    const emailParam = searchParams.get('email') || '';
    const phoneParam = searchParams.get('phone') || '';
    setEmail(emailParam);
    setPhone(phoneParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    setError('No Error...!')
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-8 bg-white space-y-6 rounded-xl mt-6"
    >
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="text-[#0077B6] hover:underline mb-4"
      >
        &larr; Back
      </button>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-[#0077B6] tracking-tight">
          New customers are waiting.
        </h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          There were <span className="font-semibold">1,353 Home Electronics Specialist</span> jobs on Us Connecter last month in your area.
        </p>

        {/* Display selected services and location */}
        {(services.length > 0 || location) && (
          <div className="text-sm text-gray-700 mt-2">
            {services.length > 0 && (
              <div>
                Services:
                <ul className="list-disc list-inside ml-2">
                  {services.map((s, idx) => (
                    <li key={idx} className="font-semibold">{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {location && (
              <p className="mt-1">
                Location: <span className="font-semibold">{location}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Email Input */}
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0096C7]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {/* Phone Input */}
      <div className="flex items-center space-x-2">
        <span className="px-3 py-2 bg-gray-200 rounded-md text-gray-600 text-sm">+1</span>
        <input
          type="tel"
          placeholder="Phone number"
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0096C7]"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      {/* Enable Text Messages */}
      <div className="flex items-start text-sm text-gray-600">
        <input
          type="checkbox"
          defaultChecked
          className="mr-2 mt-1 rounded focus:ring-0 focus:outline-none"
        />
        <p>
          Enable text messages. By checking this box, you authorize Thumbtack to send you automated text messages. Opt out anytime.
          <a href="#" className="text-[#0077B6] underline ml-1">Terms apply</a>.
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-[#0077B6] text-white px-5 py-2 rounded-[4px] text-sm font-semibold hover:bg-[#0096C7] transition focus:outline-none focus:ring-2 focus:ring-[#0096C7]"
        >
          Continue
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

      {/* Error */}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 text-center">
        By clicking Continue, you agree to the{' '}
        <a href="#" className="text-[#0077B6] underline">Terms of Use</a> and{' '}
        <a href="#" className="text-[#0077B6] underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
