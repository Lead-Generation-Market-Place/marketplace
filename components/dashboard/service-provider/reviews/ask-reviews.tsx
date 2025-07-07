'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getAuthUserId } from '@/actions/auth/authUser';
import Link from 'next/link';
import { ProgressBar } from "@/components/ui/Progressbar";
const ONBOARDING_STEPS = [
  { id: 1, name: 'Services' },
  { id: 2, name: 'Contact' },
  { id: 3, name: 'Profile' },
  { id: 4, name: 'Reviews' },
  { id: 5, name: 'Preferences' },
];  
export default function ReviewRequest() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep] = useState(4);


  const businessName = searchParams.get('businessName') || '';
  const location = searchParams.get('location') || '';
  const email = searchParams.get('email') || '';
  const phone = searchParams.get('phone') || '';
  const services = searchParams.get('services') || '';



  const [emails, setEmails] = useState(['']);
  const [isPending, startTransition] = useTransition();
  const [sendingIndex, setSendingIndex] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<{ imageUrl: string | null; username: string | null }>({ imageUrl: null, username: null });
  const [userId, setUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const fetchedUserId = await getAuthUserId();
        setUserId(fetchedUserId);
        const res = await fetch('/api/send-review-request/user');
        if (res.ok) {
          const data = await res.json();
          setUserInfo({ imageUrl: data.imageUrl, username: data.username });
        }
      } catch {
        // Fallback to nulls
      }
    }
    fetchUserInfo();
  }, []);

  const handleEmailChange = (index: number, value: string) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const addEmailField = () => setEmails([...emails, '']);

  const handleSendEmail = async (email: string, index: number) => {
    if (!email || !email.includes('@')) {
      toast.message('Please enter a valid email address.');
      return;
    }
    if (!businessName) {
      toast.message('Business name is required.');
      return;
    }

    setSendingIndex(index);
    try {
      const reviewLink = `${window.location.origin}/ask-reviews/services/${userId || ''}/reviews`;

      const res = await fetch('/api/send-review-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: email,
          userName: businessName,
          reviewLink,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Review request sent to: ${email}`);
      } else {
        toast.error(data.error || 'Failed to send review request.');
        console.error('API error:', data);
      }
    } catch (err) {
      toast.error('Failed to send review request.');
      console.error('Fetch error:', err);
    } finally {
      setSendingIndex(null);
    }
  };

  const handleNext = () => {
    const parsedServices = services
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n))
    const params = new URLSearchParams();
    if (businessName) params.set('businessName', businessName);
    if (location) params.set('location', location);
    if (email) params.set('email', email);
    if (phone) params.set('phone', phone);
    if (parsedServices.length > 0) params.set('services', parsedServices.join(',')) // ✅ Pass as CSV

    startTransition(() => {
      router.push(`/professional/preference-intro?${params.toString()}`);
    });
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    if (businessName) params.set('businessName', businessName);
    if (location) params.set('location', location);
    if (email) params.set('email', email);
    if (phone) params.set('phone', phone);

    router.push(`/professional/business-info?${params.toString()}`);
  };

  const reviewLink = typeof window !== 'undefined' && userId
    ? `${window.location.origin}/ask-reviews/services/${userId}/reviews`
    : '';

  return (
      <div>
          <ProgressBar
            currentStep={currentStep}
            totalSteps={ONBOARDING_STEPS.length}
            steps={ONBOARDING_STEPS}
            className="mb-8"
          />
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white text-[13px]">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 dark:border-gray-700 rounded-[7px] p-8 md:p-10 bg-white dark:bg-gray-900">

          {/* Left Side */}
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
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0096C7] dark:bg-gray-800 dark:text-white text-sm"
                  placeholder="Enter customer email address"
                />
                <button
                  onClick={() => handleSendEmail(email, index)}
                  className="ml-2 bg-[#0077B6] hover:bg-[#005f8e] text-white px-4 py-2 rounded-[4px] text-sm transition duration-300 flex items-center justify-center"
                  disabled={sendingIndex === index}
                >
                  {sendingIndex === index ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
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
                <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24">
                  {/* Google icon paths omitted for brevity */}
                </svg>
                Add reviews from Google
              </button>

              {userId && (
                <div className="mt-3 text-center text-xs">
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(reviewLink);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-[#0077B6] hover:underline"
                  >
                    {copied ? 'Copied to clipboard' : 'Copy shareable link'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Email preview and tips */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-[4px] border dark:border-gray-700 text-center">
              <FaRegStar className="text-[#0096C7] w-12 h-12 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Build Trust</h3>
              <p className="text-gray-600 dark:text-gray-300">More verified reviews help you earn more jobs.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-700 rounded-[8px] px-2 flex flex-col items-center text-center shadow-md">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Email Preview</p>
              <div className="flex flex-col items-center mb-3 w-full">
                <h2 className="text-2xl font-bold text-[#0077B6] mb-1 w-full">{businessName}</h2>
                <p className="text-[15px] text-[#64748b] mb-2 w-full">Review Request</p>
                {userInfo.imageUrl ? (
                  <img
                    src={userInfo.imageUrl}
                    alt="User Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#0077B6] mb-3 shadow"
                  />
                ) : (
                  <Loader2 className="w-20 h-20 text-gray-400 border-2 border-[#0077B6] rounded-full mb-3 p-4 bg-gray-100" />
                )}
                <p className="text-[12px] text-[#475569] mb-2 mt-2 w-full">
                  Thank you for being a valued client...
                </p>
                <p className="text-[12px] text-[#475569] mb-3 w-full">
                  If you could take a moment to write a brief review...
                </p>
                <div className="flex justify-center text-[#facc15] text-lg mb-3 w-full">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="mr-1" />
                  ))}
                </div>
                <Link
                  href={reviewLink}
                  target="_blank"
                  className="inline-block bg-[#0077B6] text-white px-6 py-2 rounded-[4px] font-light text-[12px] no-underline mb-2 mt-1 shadow hover:bg-[#005f8e] transition"
                >
                  Submit Review
                </Link>
                <p className="text-xs text-[12px] text-[#94a3b8] mt-2">Requested by: <strong>{userInfo.username || ''}</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white mt-6 w-full py-2 px-5 rounded-[4px]"
        >
          Back
        </button>
        <button type="button" disabled={isPending} onClick={handleNext} className={`mt-6 w-full text-white py-2 px-6 rounded-[4px] transition duration-300 flex items-center justify-center gap-2 ${isPending ? 'bg-[#0077B6]/70 cursor-not-allowed' : 'bg-[#0077B6] hover:bg-[#005f8e]'}`}>{isPending && <Loader2 className="h-4 w-4 animate-spin" />}<span className="whitespace-nowrap">Skip Now</span></button>

      </div>
    </div>
    </div>

  );
}
