'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getAuthUserId } from '@/actions/authUser';

export default function ReviewRequest() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get all passed query parameters
  const businessName = searchParams.get('businessName') || '';
  const location = searchParams.get('location') || '';
  const email = searchParams.get('email') || '';
  const phone = searchParams.get('phone') || '';

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
        
        // fallback to nulls
      }
    }
    fetchUserInfo();
  }, []);

  const handleEmailChange = (index: number, value: string) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

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
      const res = await fetch('/api/send-review-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: email,
          userName: businessName,
          reviewLink: window.location.origin + '/review',
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
    const params = new URLSearchParams();
    if (businessName) params.set('businessName', businessName);
    if (location) params.set('location', location);
    if (email) params.set('email', email);
    if (phone) params.set('phone', phone);
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
              <a
                href={`${typeof window !== 'undefined' ? window.location.host : ''}/ask-reviews/services/${userId || ''}/reviews`}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-[#0077B6] hover:underline text-xs text-center break-all cursor-pointer"
                onClick={async (e) => {
                  e.preventDefault();
                  const link = `${typeof window !== 'undefined' ? window.location.host : ''}/ask-reviews/services/${userId || ''}/reviews`;
                  await navigator.clipboard.writeText(link);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? 'Copied to clipboard' : 'Copy shareable link'}
              </a>
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

            <div className="bg-white dark:bg-gray-900 dark:border-gray-700 rounded-[8px] px-2 flex flex-col items-center text-center shadow-md">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Email Preview</p>
              <div className="flex flex-col items-center mb-3 w-full">
                <h2 className="text-2xl font-bold text-[#0077B6] mb-1 w-full">{businessName}</h2>
                <p className="text-[15px] text-[#64748b] mb-2 w-full">Review Request</p>
                {/* Avatar: fallback to Lucide icon if no imageUrl */}
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
                  Thank you for being a valued client. I’ve recently joined Yeplax to connect with more clients like you, and your feedback helps me build credibility and trust.
                </p>
                <p className="text-[12px] text-[#475569] mb-3 w-full">
                  If you could take a moment to write a brief review about our collaboration, I’d greatly appreciate it. Your input makes a meaningful difference.
                </p>
                <div className="flex justify-center text-[#facc15] text-lg mb-3 w-full">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="mr-1" />
                  ))}
                </div>
                <a
                  href="#"
                  className="inline-block bg-[#0077B6] text-white px-6 py-2 rounded-[4px] font-light text-[12px] no-underline mb-2 mt-1 shadow hover:bg-[#005f8e] transition"
                >
                  Submit Review
                </a>
                <p className="text-xs text-[12px] text-[#94a3b8] mt-2">Requested by: <strong>{userInfo.username || ''}</strong></p>
                <div className="text-[12px] border-t border-[#e2e8f0] mt-6 pt-4 text-xs text-[#94a3b8] w-full">
                  <p className=" text-[12px] my-1">© 2025 {businessName}.<br />415 Natoma Street, Suite 1300, San Francisco, CA 94103</p>
                  <p className="text-[12px] mt-1 font-bold text-[#64748b]">Help</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 right-6 flex gap-4 text-[13px] ">
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white mt-6 w-full text-[13px] py-2 px-5 rounded-[4px]"
        >
          Back
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={handleNext}
          className={`
            mt-6 w-full text-white text-[13px] py-2 px-6 rounded-[4px]
            transition duration-300 flex items-center justify-center gap-2
            ${isPending ? 'bg-[#0077B6]/70 cursor-not-allowed' : 'bg-[#0077B6] hover:bg-[#005f8e]'}
          `}
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>Next</span>
        </button>
      </div>
    </div>
  );
}
