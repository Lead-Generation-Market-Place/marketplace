'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { getAuthUserId } from '@/actions/auth/authUser';

export default function ReviewRequest() {
  const router = useRouter();
  const businessName = "Brand 2025";

  const [emails, setEmails] = useState(['']);
  const [isPending, startTransition] = useTransition();
  const [sendingIndex, setSendingIndex] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const fetchedUserId = await getAuthUserId();
        setUserId(fetchedUserId);
      } catch (error) {
        console.error('Failed to fetch user ID:', error);
        toast.error('Failed to load user information');
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
    if (emails.length < 10) {
      setEmails([...emails, '']);
    } else {
      toast.message('Maximum of 10 email addresses allowed');
    }
  };

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      const updated = emails.filter((_, i) => i !== index);
      setEmails(updated);
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendEmail = async (email: string, index: number) => {
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!businessName) {
      toast.error('Business name is required');
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

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      toast.success(`Review request sent to ${email}`);
    } catch  {
      toast.error('Failed to send review request. Please try again.');
    } finally {
      setSendingIndex(null);
    }
  };

  const handleNext = () => {
    startTransition(() => {
      router.push(`/professional/profile-setup`);
    });
  };

  const reviewLink = typeof window !== 'undefined' && userId
    ? `${window.location.origin}/ask-reviews/services/${userId}/reviews`
    : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(reviewLink);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white text-[13px]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="rounded-[7px] p-8 md:p-10 bg-white dark:bg-gray-900">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#023E8A] dark:text-white mb-3">
              Add recent ratings for your business
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Add reviews from customers your business had before you joined Thumbtack.
              This will help generate more jobs earlier on.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="space-y-3">
                {emails.map((email, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex-1 relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailChange(index, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0096C7] dark:bg-gray-800 dark:text-white text-sm"
                        placeholder="Enter customer email address"
                        disabled={sendingIndex === index}
                      />
                      {!validateEmail(email) && email && (
                        <span className="absolute right-3 top-2 text-red-500 text-xs">Invalid</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleSendEmail(email, index)}
                      disabled={sendingIndex === index || !validateEmail(email)}
                      className="ml-2 bg-[#0077B6] hover:bg-[#005f8e] text-white px-4 py-2 rounded-[4px] text-sm transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
                    >
                      {sendingIndex === index ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Send'
                      )}
                    </button>
                    {emails.length > 1 && (
                      <button
                        onClick={() => removeEmailField(index)}
                        className="text-gray-500 hover:text-red-500 p-1"
                        aria-label="Remove email"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addEmailField}
                className="text-[#0096C7] hover:underline text-sm mt-3 flex items-center"
              >
                + Add another email address
              </button>
            </div>

            <div className="pt-4">
              <button className="w-full border border-gray-300 dark:border-gray-600 py-2 rounded-[4px] flex items-center justify-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300">
                <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24">
                  <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.798-1.677-4.256-2.696-6.735-2.696-5.526 0-10 4.474-10 10s4.474 10 10 10c8.396 0 10-7.524 10-10 0-0.669-0.043-1.355-0.129-2.016h-9.871z" />
                </svg>
                Add reviews from Google
              </button>

              {userId && (
                <div className="mt-6 space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                    Or share this link with your customers:
                  </p>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-[4px]">
                    <input
                      type="text"
                      value={reviewLink}
                      readOnly
                      className="flex-1 bg-transparent text-xs text-gray-600 dark:text-gray-300 px-2 py-1 truncate"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="ml-2 bg-[#0077B6] hover:bg-[#005f8e] text-white px-3 py-1 rounded-[4px] text-xs transition duration-300 flex items-center"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <Copy className="h-3 w-3 mr-1" />
                      )}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              disabled={isPending}
              className={`text-white py-2 px-6 rounded-[4px] transition duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${isPending ? 'bg-[#0077B6]/70 cursor-not-allowed' : 'bg-[#0077B6] hover:bg-[#005f8e]'}`}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Send Request Now'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}