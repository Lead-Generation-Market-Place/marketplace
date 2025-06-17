
'use client';

import { ChevronLeft, CircleX } from "lucide-react";

export default function BackCloseButtons() {
  const handleBackButton = () => {
    window.history.back();
  };

  const handleCloseButton = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex justify-between p-3 text-gray-500 dark:text-gray-300">
      <button onClick={handleBackButton} className="hover:text-blue-600">
        <span className="inline-flex items-center gap-1 hover:text-sky-400 transform transition-transform duration-200 hover:-translate-x-1 cursor-pointer">
        <ChevronLeft className="h-5 w-5" />
        Back
        </span>

      </button>
      <button onClick={handleCloseButton} className="hover:text-red-600">
        <CircleX className="h-5 w-5 text-gray-500 hover:text-red-600 transform transition-transform duration-200 hover:scale-110 cursor-pointer" />

      </button>
    </div>
  );
}
