'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const BecomePro = () => {
  return (
    <div className="border-b border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
      
      {/* Left (Image) */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col justify-center md:items-end lg:items-end xl:items-end sm:items-start px-4"
      >
        <Image
          src="/business.svg"
          alt="Become a Pro"
          width={240}
          height={200}
          className="object-cover"
        />
      </motion.div>

      {/* Right (Text) */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col justify-center items-start space-y-5 px-4"
      >
        <h1 className="text-xl font-bold">Open for business!</h1>
        <p className="text-xs">
          Whatever kind of work you do, we&apos;ll help you find the gigs you want.
        </p>
        <Link
          href="/professional"
          className="text-sm font-semibold bg-sky-500 text-white px-6 py-2 rounded hover:bg-sky-600 transition"
        >
          Become a Yelpax Pro
        </Link>
      </motion.div>
    </div>
  );
};

export default BecomePro;
