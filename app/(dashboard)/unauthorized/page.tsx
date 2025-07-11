"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Unauthorized = ({
  title = "Unauthorized Access",
  message = "You don't have permission to view this page.",
  showReturnButton = true,
  returnUrl = "/",
  returnText = "Return to Home",
  showSupportLink = true,
  variant = "default",
}: {
  title?: string;
  message?: string;
  showReturnButton?: boolean;
  returnUrl?: string;
  returnText?: string;
  showSupportLink?: boolean;
  variant?: "default" | "danger";
}) => {
  const router = useRouter();

  const handleReturn = () => {
    router.push(returnUrl);
  };

  const Icon = variant === "danger" ? ShieldAlert : LockKeyhole;
  const iconColor = variant === "danger" ? "#ef4444" : "#0077B6";

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100  flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-400 rounded-sm  overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 p-3 rounded-full bg-[#0077B6]/10 dark:bg-[#90E0EF]/10">
                <Icon 
                  className="h-8 w-8" 
                  style={{ 
                    color: iconColor,
                    strokeWidth: variant === "danger" ? 2 : 1.5 
                  }}
                />
              </div>
              
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                {title}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              
              {showReturnButton && (
                <Button
                  onClick={handleReturn}
                  size="lg"
                  className="w-full bg-[#0077B6] hover:bg-[#0096C7] dark:bg-[#90E0EF] dark:hover:bg-[#00B4D8] dark:text-gray-900 font-medium"
                >
                  {returnText}
                </Button>
              )}
            </div>
          </div>
          
          {showSupportLink && (
            <div className="px-8 py-5 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Need higher privileges?{" "}
                <Link
                  href="/contact"
                  className="font-medium text-[#0077B6] hover:text-[#0096C7] dark:text-[#90E0EF] dark:hover:text-[#00B4D8] transition-colors"
                  prefetch={false}
                >
                  Request access
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;