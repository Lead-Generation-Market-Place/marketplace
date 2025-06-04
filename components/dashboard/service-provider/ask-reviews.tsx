'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaRegStar } from 'react-icons/fa';

export default function ReviewRequest() {
  const [emails, setEmails] = useState(['']);
  const router = useRouter();

  const handleEmailChange = (index: number, value: string) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6 text-gray-800 dark:text-white text-[13px]">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-[#023E8A] hover:underline text-sm"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border border-gray-200 dark:border-gray-700 rounded-[7px] shadow-sm p-8 md:p-10 bg-white dark:bg-gray-900">
          {/* Left Section */}
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
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  alt="Google logo"
                  className="w-4 h-4 mr-2"
                />
                Add reviews from Google
              </button>
            </div>
          </div>

          {/* Right Section (Optional branding or preview) */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-[4px] border dark:border-gray-700 text-center">
            <FaRegStar className="text-[#0096C7] w-12 h-12 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
              Build Trust
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              More verified reviews help you earn more jobs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
