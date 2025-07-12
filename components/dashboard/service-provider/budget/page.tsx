"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function WeeklyBudget() {
  const totalBudget = 125;
  const spentAmount = 60;
  const spentPercent = Math.round((spentAmount / totalBudget) * 100);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  // Memoize search params to prevent unnecessary recalculations
  const { businessName, location, email, phone, timezone, services } = useMemo(() => {
    const servicesParam = searchParams.get("services") || "";
    return {
      businessName: searchParams.get("businessName") ?? "",
      location: searchParams.get("location") ?? "",
      email: searchParams.get("email") ?? "",
      phone: searchParams.get("phone") ?? "",
      timezone: searchParams.get("timezone") ?? "",
      services: servicesParam
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n)),
    };
  }, []);

  const radius = 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = 2 * Math.PI * normalizedRadius;

  useEffect(() => {
    setTimeout(() => setProgress(spentPercent), 400);
  }, []);

  const handleNext = () => {
    const urldata = new URLSearchParams({
      businessName,
      location,
      email,
      phone,
      timezone,
      services: services.join(","),
    });
    setIsLoading(true);
    router.push(`/onboarding/background?${urldata.toString()}`)
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className=" dark:bg-[#0F172A] flex items-center justify-center px-6 ">
      <motion.div
        className="relative bg-white dark:bg-[#1E293B]  p-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Panel */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#D0EFFF] p-3 rounded-[6px]">
              <svg
                className="w-6 h-6 text-[#0077B6]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM9 5h2v2H9V5zm1 11c-1.1 0-2-.9-2-2h2v-2H8v-2h2V9c0-1.1.9-2 2-2s2 .9 2 2v1h-2v2h2v2c0 1.1-.9 2-2 2z" />
              </svg>
            </div>
            <h2 className="text-[20px] font-semibold text-[#0F172A] dark:text-white">
              Set a Weekly Budget
            </h2>
          </div>
          <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
            Your budget is the max you’ll spend weekly. We’ll send leads that
            match your preferences until your budget runs out for the week.
          </p>
        </div>

        {/* Right Panel */}
        <div className="bg-gray-50 dark:bg-[#334155] rounded-[6px] p-8 shadow-sm">
          <div className="text-[13px] text-gray-500 mb-1">3 services</div>
          <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-2">
            Your Weekly Budget
          </h3>
          <p className="text-[24px] text-[#0077B6] font-semibold mb-6">
            ${totalBudget}
          </p>

          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg width="100%" height="100%">
                <circle
                  stroke="#E5E7EB"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx="50%"
                  cy="50%"
                />
                <motion.circle
                  stroke="#0077B6"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx="50%"
                  cy="50%"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference}
                  animate={{
                    strokeDashoffset:
                      circumference -
                      (progress / 100) * circumference,
                  }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-[14px] font-bold text-[#0F172A] dark:text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {progress}%
                </motion.span>
              </div>
            </div>

            <div className="text-[13px] text-[#0F172A] dark:text-white leading-5">
              <span className="font-semibold">${spentAmount}</span> of{" "}
              <span className="font-semibold">${totalBudget}</span> spent
              <br />
              this week
            </div>
          </div>
        </div>


      </motion.div>
      {/* Navigation Buttons */}
      <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
        <button
          onClick={handleBack}
          type="button"
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white mt-6 text-[13px] py-2 px-5 rounded-[4px]"
        >
          Back
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={handleNext}
          className={`
              mt-6 text-white text-[13px] py-2 px-6 rounded-[4px]
              transition duration-300 flex items-center justify-center gap-2
              ${isLoading ? 'bg-[#0077B6]/70 cursor-not-allowed' : 'bg-[#0077B6] hover:bg-[#005f8e]'}
            `}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>Next</span>
        </button>
      </div>
    </div>
  );
}
