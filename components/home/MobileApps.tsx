import Image from "next/image";
import Link from "next/link";

const MobileApps = () => {
  return (
    <div className="flex flex-col md:flex-row my-8 md:my-16 h-auto md:h-[60vh] overflow-hidden bg-sky-500 p-4 md:p-10 items-center">
      {/* Left Side */}
      <div className="w-full justify-center">
        <div className="w-full md:w-3/4 mx-auto my-6 md:my-10 text-white flex flex-col justify-center items-start">
          <div className="flex flex-row gap-4 items-center">
            <p className="text-xs">Available On</p>
            <Image src="/apple.svg" width={15} height={15} alt="Apple Store" />
            <Image src="/google.svg" width={15} height={15} alt="Google Play" />
          </div>
          <h1 className="font-semibold mb-4 text-2xl sm:text-3xl md:text-4xl leading-tight">
            The only app you need to stay on{" "}
            <span className="text-[#0077B6]">top of everything.</span>
          </h1>
          <p className="mb-6 text-sm md:text-base">
            From personalized guides to seamless project planning — it’s all in one place, and it’s completely free.
          </p>
          <div className="flex flex-row gap-2 flex-wrap justify-center items-center">
            <fieldset className="border border-gray-100 rounded flex flex-row gap-2 p-2">
              <legend className="text-xs">Customer&apos;s App</legend>
               <Link
              href="https://apps.apple.com/app/idYOUR_APP_ID"
              target="_blank"
              rel="noopener noreferrer" >
              <img
                src="/app-store.svg"
                alt="Download on the App Store"
                className="h-6 md:h-8"
              />
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=YOUR_APP_PACKAGE"
              target="_blank"
              rel="noopener noreferrer">
              <img
                src="/google-play.png"
                alt="Get it on Google Play"
                className="h-6 md:h-8"
              />
            </Link>
            </fieldset>
            <fieldset className="border border-gray-100 rounded flex flex-row gap-2 p-2">
              <legend className="text-xs">Pro&apos;s App</legend>
               <Link
              href="https://apps.apple.com/app/idYOUR_APP_ID"
              target="_blank"
              rel="noopener noreferrer" >
              <img
                src="/app-store.svg"
                alt="Download on the App Store"
                className="h-6 md:h-8"
              />
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=YOUR_APP_PACKAGE"
              target="_blank"
              rel="noopener noreferrer">
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
      {/* Right Side (Image) */}
      <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
        <img
          src="/mobile.svg"
          alt="mobile"
          width={250}
          height={250}
          className="w-40 h-auto md:w-[300px] md:h-[250px]"
        />
      </div>
    </div>
  );
};

export default MobileApps;