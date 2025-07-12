"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

export default function BackgroundCheckSelection() {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleOptionChange = (option: string) => {
        setSelectedOption(option);
    };

    const options = [
        {
            id: "ssn",
            title: "Use your Social Security Number",
            description: "Get a background check using your SSN.",
        },
        {
            id: "id",
            title: "Don’t have a Social Security Number?",
            description: "Upload a picture of your photo ID instead.",
        },
    ];

    const searchparams = useSearchParams();
    const businessName = searchparams.get("businessName") || "";
    const location = searchparams.get("location") || "";
    const email = searchparams.get("email") || "";
    const phone = searchparams.get("phone") || "";
    const timezone = searchparams.get("timezone") || "";
    const services = searchparams.getAll("services") || [];
    const params = new URLSearchParams({
        businessName,
        location,
        email,
        phone,
        timezone,
        services: services.join(','), // All services as comma-separated
    });

const handleNext = () => {
    if (!selectedOption) return; // Prevent navigation if nothing selected
    setIsLoading(true);

    const nextRoute =
        selectedOption === "ssn"
            ? "/onboarding/check-ssn"
            : "/onboarding/check-doc";

    router.push(`${nextRoute}?${params.toString()}`);
};


    const handleBack = () => {
        router.back();
    };


    return (
        <div className="dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4 py-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full bg-white dark:bg-gray-800  dark:border-gray-700 rounded-[6px] p-8 md:p-10"
            >
                <h1 className="text-2xl font-bold text-[#023E8A] dark:text-white mb-3">
                    Get a free background check
                </h1>
                <p className="text-[13px] text-gray-600 dark:text-gray-300 mb-8">
                    This is required to join Thumbtack. It’s free, won’t affect your credit,
                    and builds trust with customers.
                </p>

                <div className="space-y-5">
                    {options.map((option) => (
                        <motion.div
                            key={option.id}
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.015 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => handleOptionChange(option.id)}
                            className={`relative cursor-pointer border rounded-[6px] px-6 py-5 group transition-colors duration-300 flex items-start gap-4 ${selectedOption === option.id
                                    ? "bg-[#E0F4FF] dark:bg-[#1e3a50] border-[#0096C7]"
                                    : "border-gray-300 dark:border-gray-600 hover:border-[#0096C7]/50"
                                }`}
                        >
                            {/* Animated Check Circle */}
                            <div
                                className={`w-6 h-6 mt-1 flex items-center justify-center rounded-full border transition-colors duration-300 ${selectedOption === option.id
                                        ? "bg-[#0096C7] border-[#0096C7]"
                                        : "border-gray-400 dark:border-gray-500"
                                    }`}
                            >
                                <AnimatePresence>
                                    {selectedOption === option.id && (
                                        <motion.div
                                            initial={{ scale: 0.6, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.6, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <Check className="w-4 h-4 text-white" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Text Content */}
                            <div>
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                    {option.title}
                                </h3>
                                <p className="text-[13px] text-gray-500 dark:text-gray-300 mt-1">
                                    {option.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
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
                    onClick={handleNext}
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
    );
}
