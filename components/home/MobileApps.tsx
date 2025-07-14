'use client';

import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
} from 'lucide-react';
import { motion } from 'framer-motion';

const MobileApps = () => {
  return (
    <section className="my-5 bg-sky-50 dark:bg-sky-900 transition-colors duration-300 border border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center px-6 pt-5">

        {/* Left Side - App Download Section */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
          className="p-4 w-full md:w-1/2 mb-10 md:mb-0 lg:border-r sm:border-0 border-sky-200 dark:border-gray-500"
        >
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">
            The only app you need to stay on{" "}
            <span className="text-sky-600 dark:text-sky-300">top of everything.</span>
          </h1>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
            From personalized guides to seamless project planning, it&apos;s all in one place and completely free.
          </p>

          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            {/* Customer App */}
            <fieldset className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full md:w-auto">
              <legend className="text-xs text-gray-600 dark:text-gray-300 px-2">Customer&apos;s App</legend>
              <div className="flex items-center gap-2">
                <Link href="https://apps.apple.com/app/idYOUR_APP_ID" target="_blank" rel="noopener noreferrer">
                  <img src="/app-store.svg" alt="Download on the App Store" className="h-8 hover:scale-105 transition-transform" />
                </Link>
                <Link href="https://play.google.com/store/apps/details?id=YOUR_APP_PACKAGE" target="_blank" rel="noopener noreferrer">
                  <img src="/google-play.png" alt="Get it on Google Play" className="h-8 hover:scale-105 transition-transform" />
                </Link>
              </div>
            </fieldset>

            {/* Pro's App */}
            <fieldset className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full md:w-auto">
              <legend className="text-xs text-gray-600 dark:text-gray-300 px-2">Pro&apos;s App</legend>
              <div className="flex items-center gap-2">
                <Link href="https://apps.apple.com/app/idYOUR_APP_ID" target="_blank" rel="noopener noreferrer">
                  <img src="/app-store.svg" alt="Download on the App Store" className="h-8 hover:scale-105 transition-transform" />
                </Link>
                <Link href="https://play.google.com/store/apps/details?id=YOUR_APP_PACKAGE" target="_blank" rel="noopener noreferrer">
                  <img src="/google-play.png" alt="Get it on Google Play" className="h-8 hover:scale-105 transition-transform" />
                </Link>
              </div>
            </fieldset>
          </div>
        </motion.div>

        {/* Right Side - Stats */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full md:w-1/2 flex flex-col items-center"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">1 Billion+</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Leads Generated On Yelpax</p>
          </div>

          <div className="flex gap-2">
            {[
              { value: "110,000+", label: "Business Partners", border: "border-1" },
              { value: "450,000+", label: "Crafty Professionals", border: "border-2" },
              { value: "100+", label: "Countries Users", border: "border-1" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-sky-800 rounded p-2 sm:p-4 text-center transition-transform hover:scale-105 border-sky-500 dark:border-sky-600 ${stat.border}`}
              >
                <h3 className="text-base sm:text-lg font-semibold text-sky-700 dark:text-sky-300">
                  {stat.value}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Social Media */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
        viewport={{ once: true, amount: 0.2 }}
        className="my-2 text-center"
      >
        <h6 className="text-xs text-sky-600 dark:text-gray-200 mb-2">Also join us on social media</h6>
        <div className="flex gap-5 text-gray-700 dark:text-white justify-center items-center">
          <Link href="/"><Facebook className="w-5 h-5 hover:text-blue-600" /></Link>
          <Link href="/"><Instagram className="w-5 h-5 hover:text-pink-500" /></Link>
          <Link href="/"><Linkedin className="w-5 h-5 hover:text-sky-700" /></Link>
          <Link href="/"><Mail className="w-5 h-5 hover:text-orange-500" /></Link>
          <Link href="/"><Twitter className="w-5 h-5 hover:text-blue-500" /></Link>
        </div>
      </motion.div>
    </section>
  );
};

export default MobileApps;
