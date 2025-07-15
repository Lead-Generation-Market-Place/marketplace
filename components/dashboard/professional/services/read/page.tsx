"use client";

import React, { useEffect, useState } from "react";
import { Plus, Info, ChevronRight, TrendingUp, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import ServicesSelected from "@/components/elements/ServicesSelected";
import { Provider } from '@/actions/professional/services/read-services';
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Location {
  id: number;
  state: string;
}

interface ProviderLocation {
  id: number;
  state_id: number;
  locations: Location[];
}

interface ProviderData {
  business_name: string;
  provider_locations: ProviderLocation[];
}

export default function Services() {
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setIsLoading(true);
        const providerResult = await Provider();
        if (providerResult.state === 'success' && providerResult.data) {
          setProviderData(providerResult.data);
        } else {
          toast.error('Failed to fetch provider data');
        }
      } catch  {
        toast.error('An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviderData();
  }, []);

  // Loading skeleton for header
  const HeaderLoading = () => (
    <div className="animate-pulse space-y-2">
      <Skeleton height={32} width={200} />
      <Skeleton height={16} width={150} />
    </div>
  );

  // Loading skeleton for main content card
  const MainContentLoading = () => (
    <div className="dark:bg-gray-800 p-6 rounded-[4px] shadow space-y-4 animate-pulse">
      <Skeleton height={24} width={150} />
      <Skeleton count={3} />
      <Skeleton height={20} width={200} />
      <div className="space-y-4">
        <Skeleton height={100} />
      </div>
      <Skeleton height={40} width={150} />
    </div>
  );

  // Loading skeleton for sidebar cards
  const SidebarCardLoading = () => (
    <div className="dark:bg-gray-800 p-6 rounded-[4px] shadow space-y-4 animate-pulse">
      <Skeleton height={24} width={150} />
      <div className="flex justify-between">
        <Skeleton height={60} width={80} />
        <Skeleton height={60} width={80} />
        <Skeleton height={60} width={80} />
      </div>
      <Skeleton height={20} width={120} />
    </div>
  );

  return (
    <div className="dark:bg-gray-900 p-2 lg:p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <header className="animate-fade-in-up">
          {isLoading ? (
            <HeaderLoading />
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {providerData?.business_name || 'Your Services'}
              </h1>
              <p className="text-gray-800 dark:text-gray-300 flex items-center space-x-2">
                <span>
                  {providerData?.provider_locations?.[0]?.locations ? (
                    Array.isArray(providerData.provider_locations[0].locations) ? (
                      providerData.provider_locations[0].locations.map((location) => (
                        <span key={location.id} className="text-gray-600 text-[13px] dark:text-gray-400">
                          {location.state}
                        </span>
                      ))
                    ) : (
                      <span className="dark:text-gray-400 text-[#0077B6] text-[13px]">
                        {(providerData.provider_locations[0].locations as Location)?.state}, United States
                      </span>
                    )
                  ) : (
                    <span className="dark:text-gray-400 text-[#0077B6] text-[13px]">
                      Loading location...
                    </span>
                  )}
                </span>
              </p>
            </>
          )}
        </header>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            {isLoading ? (
              <MainContentLoading />
            ) : (
              <div className="dark:bg-gray-800 p-6 rounded-[4px] shadow space-y-4">
                <h2 className="text-1xl font-semibold text-gray-800 dark:text-gray-100">
                  Your Services
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-[13px]">
                  Set your job preferences, activate or deactivate services, and choose where you want to
                  work.
                </p>
                <a
                  href="#"
                  className="text-[13px] inline-flex items-center text-[#0077B6] dark:text-[#90e0ef] hover:text-[#005f91] dark:hover:text-[#48cae4] font-medium transition"
                >
                  <Info className="w-4 h-4 mr-2" />
                  View our guide to job preferences
                </a>

                <div className="space-y-4">{/* Future service items */}</div>

                <Link
                  href="/professional"
                  className="inline-flex items-center px-4 text-[13px] py-2 bg-gradient-to-r from-[#0077B6] to-[#005f91] text-white rounded-[4px] hover:from-[#005f91] hover:to-[#005f91] transition shadow"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add a Service
                </Link>
              </div>
            )}
            
            <div className="mt-6">
              <ServicesSelected isLoading={isLoading} />
            </div>
          </motion.div>

          {/* Sidebar */}
          <aside className="flex flex-col space-y-6 mt-8 lg:mt-0 w-full lg:w-1/3">
            {isLoading ? (
              <>
                <SidebarCardLoading />
                <SidebarCardLoading />
              </>
            ) : (
              <>
                {/* Activity This Week Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="dark:bg-gray-800 p-6 rounded-[4px] shadow space-y-4 hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-base font-semibold flex items-center gap-2 text-[#005f91] dark:text-[#48cae4]">
                    <TrendingUp className="w-5 h-5 text-green-600" /> Activity this week
                  </h3>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-xl font-bold text-[#0077B6] dark:text-[#90e0ef]">$0</p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">spent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-[#0077B6] dark:text-[#90e0ef]">0</p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">leads</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-[#0077B6] dark:text-[#90e0ef]">0</p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">views</p>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="inline-flex items-center text-[#0077B6] dark:text-[#90e0ef] hover:text-blue-800 dark:hover:text-[#48cae4] text-sm transition"
                  >
                    Business insights
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
                </motion.div>

                {/* Spending This Week Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="dark:bg-gray-800 p-6 rounded-[4px] shadow items-center space-y-4 hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-base font-semibold flex items-center gap-2 text-[#005f91] dark:text-[#48cae4]">
                    <Wallet className="w-5 h-5 text-purple-600" /> Spending this week
                  </h3>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg font-bold text-[#0077B6] dark:text-[#90e0ef]">$0</p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">$85 budget spent</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#0077B6] dark:text-[#90e0ef]">$0</p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">additional spent</p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}