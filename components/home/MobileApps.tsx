
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Twitter } from "lucide-react";

const MobileApps = () => {
  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[60vh] overflow-hidden bg-sky-500 dark:bg-sky-900 p-4 md:p-10 items-center transition-colors duration-300">
      {/* Left Side */}
      <div className="w-full justify-center">
        <div className="w-full md:w-3/4 mx-auto my-4 md:my-10 flex flex-col justify-center items-start">
          {/* <div className="flex flex-row gap-4 items-center">
            <p className="text-xs text-white dark:text-white">Available On</p>
            <Image src="/apple.svg" width={15} height={15} alt="Apple Store" />
            <Image src="/google.svg" width={15} height={15} alt="Google Play" />
          </div> */}
          <h1 className="font-semibold mb-4 text-xl sm:text-xl md:text-4xl leading-tight text-white dark:text-white">
            The only app you need to stay on{" "}
            <span className="text-[#0077B6] dark:text-sky-300">top of everything.</span>
          </h1>
          <p className="mb-4 text-xs md:text-base text-white dark:text-gray-200">
            From personalized guides to seamless project planning, it&apos;s all in one place, and it&apos;s completely free.
          </p>
          <div className="">
            <h6 className="pb-2 text-sm text-gray-800 dark:text-gray-200">Follow us on</h6>
            <div className="flex flex-row gap-2">
                <Link href="/"><Facebook className="w-8 h-5 hover:text-sky-500 transition-colors" /></Link>
                <Link href="/"><Instagram className="w-8 h-5 hover:text-pink-500 transition-colors" /></Link>
                <Link href="/"><Linkedin className="w-8 h-5 hover:text-sky-600 transition-colors" /></Link>
                <Link href="/"><Mail className="w-8 h-5 hover:text-orange-400 transition-colors" /></Link>
                <Link href="/"><Twitter className="w-8 h-5 hover:text-blue-500 transition-colors" /></Link>
            </div>
          </div>
        </div>
      </div>
      {/* Right Side (App Download Buttons) */}
      <div className="w-full md:w-1/2 flex justify-center mt-4 md:mt-0">
        <div className="flex flex-row gap-2 flex-wrap justify-center items-center">
          <fieldset className="border border-gray-100 dark:border-gray-500 rounded flex flex-row gap-2 p-2">
            <legend className="text-xs text-white dark:text-gray-100">Customer&apos;s App</legend>
            <Link
              href="https://apps.apple.com/app/idYOUR_APP_ID"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/app-store.svg"
                alt="Download on the App Store"
                className="h-6 md:h-8"
              />
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=YOUR_APP_PACKAGE"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/google-play.png"
                alt="Get it on Google Play"
                className="h-6 md:h-8"
              />
            </Link>
          </fieldset>
          <fieldset className="border border-gray-100 dark:border-gray-500 rounded flex flex-row gap-2 p-2">
            <legend className="text-xs text-white dark:text-gray-100">Pro&apos;s App</legend>
            <Link
              href="https://apps.apple.com/app/idYOUR_APP_ID"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/app-store.svg"
                alt="Download on the App Store"
                className="h-6 md:h-8"
              />
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=YOUR_APP_PACKAGE"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/google-play.png"
                alt="Get it on Google Play"
                className="h-6 md:h-8"
              />
            </Link>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default MobileApps;