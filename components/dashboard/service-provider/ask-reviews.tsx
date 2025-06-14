'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaRegStar, FaStar } from 'react-icons/fa';

export default function ReviewRequest() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get all passed query parameters
  const businessName = searchParams.get('businessName') || '';
  const location = searchParams.get('location') || '';
  const email = searchParams.get('email') || '';
  const phone = searchParams.get('phone') || '';
  const services = JSON.parse(searchParams.get('services') || '[]');

  const [emails, setEmails] = useState(['']);

  const handleEmailChange = (index: number, value: string) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const handleSendEmail = (email: string) => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    alert(`Review request sent to: ${email}`);
  };

  const handleNext = () => {
    const params = new URLSearchParams();
    if (businessName) params.set('businessName', businessName);
    if (location) params.set('location', location);
    if (email) params.set('email', email);
    if (phone) params.set('phone', phone);
    if (services.length) params.set('services', JSON.stringify(services));
    
    router.push(`/professional/preference-intro?${params.toString()}`);
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    if (businessName) params.set('businessName', businessName);
    if (location) params.set('location', location);
    if (email) params.set('email', email);
    if (phone) params.set('phone', phone);
    if (services.length) params.set('services', JSON.stringify(services));

    router.push(`/professional/progress?${params.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white text-[13px]">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 dark:border-gray-700 rounded-[7px] p-8 md:p-10 bg-white dark:bg-gray-900">
          
          {/* Left: Email Inputs and Google Reviews */}
          <div>
            <h2 className="text-2xl font-bold text-[#023E8A] dark:text-white mb-3">
              Add recent ratings for your business
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-5">
              Add reviews from customers your business had before you joined Thumbtack.
              This will help generate more jobs earlier on.
            </p>

            {emails.map((email, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0096C7] focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
                  placeholder="Enter customer email address"
                />
                <button
                  onClick={() => handleSendEmail(email)}
                  className="ml-2 bg-[#0077B6] hover:bg-[#005f8e] text-white px-4 py-2 rounded-[4px] text-sm transition duration-300"
                >
                  Send
                </button>
              </div>
            ))}

            <button
              onClick={addEmailField}
              className="text-[#0096C7] hover:underline text-sm mb-6 mt-2 flex items-center"
            >
              + Add another email address
            </button>

            <div className="mb-4">
              <button className="w-full border border-gray-300 dark:border-gray-600 py-2 rounded-[4px] flex items-center justify-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300">
                <svg
                  className="mr-2 w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Add reviews from Google
              </button>
            </div>
          </div>

          {/* Right: Tips + Email Preview */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-[4px] border dark:border-gray-700 text-center">
              <FaRegStar className="text-[#0096C7] w-12 h-12 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                Build Trust
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                More verified reviews help you earn more jobs.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-700 rounded-[4px] p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Email Preview</p>
              <div className="flex items-center mb-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="User"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                  How would you rate your overall experience with {businessName}?
                </h4>
              </div>
              <div className="flex text-[#0096C7] text-sm mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="mr-1" />
                ))}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 text-justify text-[12px]">
                Thanks for being a valued customer. I just signed up on Thumbtack to find more excellent customers like you, and reviews are a big part of my profile. Can you take a moment to write a couple sentences about working with me? I’d love if my future customers could hear about your experience firsthand.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-[12px]">Thanks, {businessName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
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
          Ask it Later
        </button>
      </div>
    </div>
  );
}
