"use client";

import React, { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { motion, useInView, useAnimation, stagger, animate } from "framer-motion";

export default function ReviewsSetup() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const controls = useAnimation();

  // Color definitions
  const colors = {
    primary: "#023E8A",
    secondary: "#0077B6",
    accent: "#90E0EF",
    light: "#CAF0F8",
    dark: {
      primary: "#0096C7",
      secondary: "#00B4D8"
    }
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
      animate(
        ".progress-bar",
        { width: ["0%", "100%"] },
        { duration: 1.2, delay: stagger(0.08), ease: "easeInOut" }
      );
    }
  }, [isInView, controls]);

  const starVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5 
    },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { 
        delay: i * 0.08,
        type: "spring" as const,
        stiffness: 200,
        damping: 10
      }
    })
  };

  return (
    <motion.div 
      ref={containerRef}
      initial="hidden"
      animate={controls}
      className="max-w-5xl mx-auto p-6 space-y-6"
    >
      {/* Notification Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="rounded p-4 flex justify-between items-center shadow-sm"
        style={{ backgroundColor: colors.primary }}
      >
        <div>
          <h1 className="text-base font-medium mb-0.5 text-white">You are almost there!</h1>
          <p className="text-xs text-blue-100">Complete your profile to become visible to customers.</p>
        </div>
        <button 
          className="text-xs font-medium px-4 py-1.5 rounded hover:opacity-90 transition-opacity duration-150"
          style={{ 
            backgroundColor: colors.light,
            color: colors.secondary
          }}
        >
          Ask for reviews
        </button>
      </motion.div>

      {/* Reviews Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="space-y-1"
      >
        <h2 className="text-xl font-bold" style={{ color: colors.primary }}>Customer Reviews</h2>
        <p className="text-xs text-gray-600 dark:text-gray-300">Build trust by showcasing your happy customers.</p>
      </motion.div>

      {/* Rating Summary */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex items-center gap-2"
      >
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={starVariants}
              initial="hidden"
              animate="visible"
            >
              <Star className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-500"}`} />
            </motion.div>
          ))}
        </div>
        <span className="font-medium text-xs" style={{ color: colors.primary }}>4.95 out of 5</span>
        <span className="text-gray-500 dark:text-gray-400 text-xs">(1,745 ratings)</span>
      </motion.div>

      {/* Progress Bars */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="space-y-1.5"
      >
        {[
          { label: "5 star", percent: 70, color: colors.light },
          { label: "4 star", percent: 17, color: colors.accent },
          { label: "3 star", percent: 8, color: colors.secondary },
          { label: "2 star", percent: 4, color: colors.primary },
          { label: "1 star", percent: 1, color: "#03045E" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-4">
            <span className="w-10 text-xs font-medium" style={{ color: colors.primary }}>{item.label}</span>
            <div className="w-full h-4 bg-gray-100 dark:bg-gray-700 rounded=[2px] overflow-hidden">
              <motion.div
                className="progress-bar h-full rounded"
                initial={{ width: 0 }}
                animate={{ width: `${item.percent}%` }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                style={{ backgroundColor: item.color }}
              />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-300 w-6">{item.percent}%</span>
          </div>
        ))}
      </motion.div>

      {/* No Reviews Placeholder */}
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, type: "spring", stiffness: 300 }}
        className="text-center border border-dashed border-gray-200 dark:border-gray-600 rounded p-6 bg-gray-50 dark:bg-gray-800"
      >
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">You have not received any reviews yet.</p>
        <button 
          className="text-xs px-5 py-2 rounded font-medium hover:opacity-90 transition-opacity duration-150"
          style={{ 
            backgroundColor: colors.primary,
            color: "white"
          }}
        >
          Request Reviews
        </button>
      </motion.div>
    </motion.div>
  );
}