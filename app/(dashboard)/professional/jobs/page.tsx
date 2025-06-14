// components/WelcomeCard.tsx
import React from "react";
import Link from "next/link";

export default function WelcomeCard() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Welcome to Yelpax.</h1>
      <p className="text-gray-600 mb-8 text-center ">
        Leads that exactly match your preferences appear here.
      </p>



      <p className="text-gray-700 mb-4">Start getting leads by finishing account setup.</p>

      <Link
        href="/setup"
        className="bg-[#004fb6] hover:bg-[#0077B6] text-white px-6 py-2 rounded-[4px] font-medium transition"
      >
        Finish setup
      </Link>
    </div>
  );
}
