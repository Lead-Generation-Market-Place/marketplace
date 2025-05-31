import { CheckCircle, Star, BadgeCheck, Clock } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex items-center justify-center text-[13px] bg-white dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-[7px] overflow-hidden w-full max-w-4xl border border-gray-200 dark:border-gray-700 shadow-sm">

        {/* Left Section - Business Name Entry */}
        {/* Left Section - Business Name Entry */}
        <div className="p-8 md:p-10 bg-white dark:bg-gray-900">
          <h2 className="text-2xl font-bold text-[#023E8A] dark:text-white mb-3">
            Stand out to customers.
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-base mb-5 text-[13px]">
            Add a few details to your profile to help customers get to know you better.
          </p>

          <label htmlFor="businessName" className="text-[13px] block text-gray-700 dark:text-gray-300 font-semibold text-sm mb-2">
            First, enter your business name.
          </label>
          <input
            id="businessName"
            type="text"
            placeholder="Business Name"
            className="mt-1 block w-full text-[13px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0096C7] focus:border-transparent text-gray-800 dark:text-white dark:bg-gray-800 text-sm"
          />

          {/* Next Button */}
          <button className="mt-6 w-full bg-[#0096C7] hover:bg-[#007bb5] text-white text-[13px] py-2 px-5 rounded-[4px] transition duration-300">
            Next
          </button>
        </div>
        {/* Right Section - Profile Card */}
        <div className="bg-gray-50 dark:bg-gray-800 p-8 md:p-10 border-t dark:border-gray-700 md:border-l md:border-t-0">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2" style={{ borderColor: '#0096C7' }}>
              <Image
                src="/ServiceProvider/ServiceProfile.jpg"
                alt="Handyman"
                className="object-cover w-full h-full"
                width={80}
                height={80}
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              ACE <span className="font-medium text-gray-700 dark:text-gray-300">Handyman</span>
            </h3>
            {/* Verified Badge */}
            <div className="mt-1 flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium">
              <BadgeCheck className="w-4 h-4" />
              Verified
            </div>

            <div className="mt-2 text-green-600 font-semibold text-base flex items-center gap-1">
              <Star className="w-4 h-4 text-green-500" /> Good 4.0
            </div>
            <div className="flex items-center gap-1 text-yellow-500 mt-1 text-sm">
              <span>★★★★☆</span>
              <span className="text-gray-500 dark:text-gray-400">(11 reviews)</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 text-[13px]">
              <span className="bg-[#0096C7]/10 text-[#0096C7] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <BadgeCheck className="w-4 h-4" /> In high demand
              </span>
              <span className="bg-green-100 dark:bg-green-200/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Clock className="w-4 h-4" /> Fast response
              </span>
            </div>

            <ul className="mt-5 space-y-2 text-gray-600 dark:text-gray-300 text-sm text-left">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#0096C7]" /> 82 hires on Thumbtack</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#0096C7]" /> Background checked</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#0096C7]" /> 5 years in business</li>
            </ul>

            <button className="mt-6 w-full bg-[#023E8A] hover:bg-[#022d6b] text-white text-[13px] py-2 px-5 rounded-[4px] transition duration-300">
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
