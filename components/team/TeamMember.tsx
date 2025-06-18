'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, X, ChevronRight, ChevronLeft } from 'lucide-react';

const teamMembers = null;

const slides = [
  {
    title: 'Connect with Trusted Pros',
    description: 'Easily browse and select verified professionals in your area.',
    image: '/team/slide1.svg',
  },
  {
    title: 'Chat, Book & Refer',
    description: 'Message your favorites, book appointments, and refer them with ease.',
    image: '/team/slide2.svg',
  },
  {
    title: 'Everything in One Place',
    description: 'Manage all your professionals from a single, convenient dashboard.',
    image: '/team/slide3.svg',
  },
];

const TeamMember = () => {
  const [showModal, setShowModal] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Your Team</h2>

      {teamMembers ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Render team members here */}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center text-gray-900 dark:text-white">
          <Image
            src="/team/team.svg"
            width={200}
            height={200}
            alt="Team illustration"
            className="mb-6 w-full max-w-xs"
          />

          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Gather trusted experts for your team
          </h2>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md mb-4">
            Book, message, and refer trusted pros without the hassle—all in one place.
          </p>

          <Link
            href="/"
            className="inline-block px-4 py-2 w-[40%] text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded transition"
          >
            Find a Pro
          </Link>

          <button
            onClick={() => setShowModal(true)}
            className="underline font-semibold mt-10 text-sky-500 flex items-center"
          >
            Tell me more <ArrowRight className="ml-1 w-5 h-5" />
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 transition-colors duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md sm:max-w-lg p-6 sm:p-8 relative shadow-lg max-h-[90vh] overflow-y-auto transition-all duration-300">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-700 dark:text-gray-300 hover:text-red-500"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center text-center">
              <Image
                src={slides[slideIndex].image}
                alt={slides[slideIndex].title}
                width={150}
                height={150}
                className="mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {slides[slideIndex].title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {slides[slideIndex].description}
              </p>

              <div className="flex justify-between items-center w-full mt-4">
                <button
                  onClick={prevSlide}
                  className="text-sky-500 hover:text-sky-700 dark:text-sky-400"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <span className="text-sm text-gray-400 dark:text-gray-500">
                  Slide {slideIndex + 1} of {slides.length}
                </span>

                {slideIndex === slides.length - 1 ? (
                  <Link
                    href="/"
                    className="inline-block px-4 py-2 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded transition"
                  >
                    Find a Pro
                  </Link>
                ) : (
                  <button
                    onClick={nextSlide}
                    className="text-sky-500 hover:text-sky-700 dark:text-sky-400"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMember;
