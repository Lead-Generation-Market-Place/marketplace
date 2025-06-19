// app/dashboard/page.tsx
"use client";

import React from "react";
import { Plus, Info, ChevronRight, TrendingUp, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className=" dark:bg-gray-900 p-2 lg:p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <header className="animate-fade-in-up">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BCC Brand</h1>
          <p className="text-gray-800 dark:text-gray-300 flex items-center space-x-2">
            <span>📍</span>
            <span>Falls Church</span>
          </p>
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
            <div className=" dark:bg-gray-800 p-6 rounded-[4px] shadow space-y-4">
              <h2 className="text-1xl font-semibold text-gray-800 dark:text-gray-100">Your Services</h2>
              <p className="text-gray-600 dark:text-gray-300 text-[13px]">
                Set your job preferences, activate or deactivate services, and choose where you want to work.
              </p>
              <a
                href="#"
                className="text-[13px] inline-flex items-center text-[#0077B6] dark:text-[#90e0ef] hover:text-[#005f91] dark:hover:text-[#48cae4] font-medium transition"
              >
                <Info className="w-4 h-4 mr-2" />
                View our guide to job preferences
              </a>

              {/* Placeholder for Service List */}
              <div className="space-y-4">{/* Future service items */}</div>

              <Link href="/professional"
                className="inline-flex items-center px-4 text-[13px] py-2 bg-gradient-to-r from-[#0077B6] to-[#005f91] text-white rounded-[4px] hover:from-[#005f91] hover:to-[#005f91] transition shadow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add a Service
              </Link >
            </div>
          </motion.div>

          {/* Sidebar */}
          <aside className="flex flex-col space-y-6 mt-8 lg:mt-0 w-full lg:w-1/3">
            {/* Activity This Week Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className=" dark:bg-gray-800 p-6 rounded-[4px] shadow space-y-4 hover:shadow-xl transition-shadow duration-300"
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
              className=" dark:bg-gray-800 p-6 rounded-[4px] shadow items-center space-y-4 hover:shadow-xl transition-shadow duration-300"
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
          </aside>
        </div>
      </div>
    </div>
  );
}
