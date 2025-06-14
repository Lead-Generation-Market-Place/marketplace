'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function LoadingScreen({ status }: { status: string }) {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">

      {/* Subtle animated background glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 2 }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#023E8A] via-transparent to-transparent dark:from-[#0077B6]"
      />

      {/* Yelpax Logo */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-6"
      >
        <Image
          src="/yelpax.png"
          alt="Yelpax"
          width={160}
          height={40}
          className="object-contain"
          priority
        />
      </motion.div>

      {/* Status Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center"
      >
        <h1 className="text-lg md:text-xl font-semibold tracking-tight">
          {status}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Yelpax is loading your workspace. Please hold on.
        </p>
      </motion.div>

      {/* Elegant pulse bar */}
      <div className="mt-10 w-64 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
        <motion.div
          className="absolute left-0 top-0 h-full w-1/3 rounded-full bg-gradient-to-r from-blue-500 to-blue-300 dark:from-blue-400 dark:to-blue-200"
          animate={{ x: ['-50%', '100%'] }}
          transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity }}
        />
      </div>

      {/* Footer watermark */}
      <div className="absolute bottom-4 text-xs text-gray-400 dark:text-gray-600">
        Powered by <span className="font-medium text-blue-500">Yelpax Engine</span>
      </div>
    </div>
  )
}
