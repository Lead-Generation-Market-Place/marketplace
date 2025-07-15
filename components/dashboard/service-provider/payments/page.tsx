"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";

// Zod validation schema
const cardSchema = z.object({
  cardNumber: z
    .string()
    .min(13, "Card number must be at least 13 digits")
    .max(19, "Card number can't exceed 19 digits")
    .refine((val) => /^[0-9\s]+$/.test(val), "Card number must contain only digits")
    .refine((val) => luhnCheck(val), "Invalid card number"),
  expiration: z
    .string()
    .regex(/^(0[1-9]|1[0-2]) \/ \d{2}$/, "Use MM / YY format")
    .refine(isFutureDate, "Expiration must be in the future"),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
  zip: z.string().regex(/^\d{5}$/, "ZIP must be 5 digits"),
});

function luhnCheck(value: string): boolean {
  const digits = value.replace(/\s+/g, "").split("").reverse().map(Number);
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i];
    if (i % 2 !== 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

function isFutureDate(value: string): boolean {
  const [month, year] = value.split(" / ").map(Number);
  if (!month || !year) return false;
  const now = new Date();
  const expiry = new Date(`20${year}`, month - 1, 1);
  return expiry >= new Date(now.getFullYear(), now.getMonth(), 1);
}

export default function PaymentCardForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.currentTarget);

    const values = {
      cardNumber: formData.get("cardNumber") as string,
      expiration: formData.get("expiration") as string,
      cvc: formData.get("cvc") as string,
      zip: formData.get("zip") as string,
    };

    const result = cardSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 dark:bg-gray-900">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-[#0077B6] dark:text-[#9dd6ff] mb-2">
        Payment
      </h2>

      {/* Description */}
      <p className="mb-8 text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl">
        You won’t be charged right now. You auto-pay when a lead matches your preferences.
      </p>

      {/* Form */}
      <form
        className="dark:bg-gray-800 p-6 rounded-[6px] dark:border-gray-700 mb-2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Card Number */}
          <div className="flex-1">
            <label
              htmlFor="cardNumber"
              className="block text-[13px] font-semibold mb-1 text-gray-800 dark:text-gray-200"
            >
              Enter your card number
            </label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              placeholder="1234 1234 1234 1234"
              required
              className="w-full rounded-[4px] border border-gray-300 dark:border-gray-600 p-3 text-[13px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-1 focus:ring-[#0077B6] focus:border-transparent"
            />
            {errors.cardNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              This will be your default payment method on Yelpax.
            </p>
          </div>

          {/* Expiration */}
          <div className="w-28 flex-shrink-0">
            <label
              htmlFor="expiration"
              className="block text-[13px] font-semibold mb-1 text-gray-800 dark:text-gray-200"
            >
              Expiration
            </label>
            <input
              id="expiration"
              name="expiration"
              type="text"
              placeholder="MM / YY"
              required
              className="w-full rounded-[4px] border border-gray-300 dark:border-gray-600 p-3 text-[13px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-1 focus:ring-[#0077B6] focus:border-transparent"
            />
            {errors.expiration && (
              <p className="text-xs text-red-500 mt-1">{errors.expiration}</p>
            )}
          </div>

          {/* CVC */}
          <div className="w-28 flex-shrink-0">
            <label
              htmlFor="cvc"
              className="block text-[13px] font-semibold mb-1 text-gray-800 dark:text-gray-200"
            >
              CVC
            </label>
            <input
              id="cvc"
              name="cvc"
              type="text"
              placeholder="CVC"
              required
              className="w-full rounded-[4px] border border-gray-300 dark:border-gray-600 p-3 text-[13px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-1 focus:ring-[#0077B6] focus:border-transparent"
            />
            {errors.cvc && (
              <p className="text-xs text-red-500 mt-1">{errors.cvc}</p>
            )}
          </div>

          {/* Zip code */}
          <div className="w-28 flex-shrink-0">
            <label
              htmlFor="zip"
              className="block text-[13px] font-semibold mb-1 text-gray-800 dark:text-gray-200"
            >
              Zip code
            </label>
            <input
              id="zip"
              name="zip"
              type="text"
              placeholder="90210"
              required
              className="w-full rounded-[4px] border border-gray-300 dark:border-gray-600 p-3 text-[13px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-1 focus:ring-[#0077B6] focus:border-transparent"
            />
            {errors.zip && (
              <p className="text-xs text-red-500 mt-1">{errors.zip}</p>
            )}
          </div>
        </div>

        {/* Submit button */}
        <div className="mt-4 max-w-xs">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center gap-2 bg-[#0077B6] hover:bg-[#005f8e] text-white font-semibold text-[13px] py-3 rounded-[4px] transition ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            Add card
          </button>
        </div>
      </form>

      {/* Info section */}
      <div className="flex items-center dark:bg-blue-900/20 text-[#0077B6] dark:text-blue-400 px-4 py-3 rounded-[4px] mb-4">
        <span className="mr-3 text-xl select-none" aria-hidden="true">
          💡
        </span>
        <div>
          <p className="text-[13px] font-semibold">What is my card used for?</p>
          <p className="text-[13px] ">
            Adding a card allows you to be seen by customers. You’re charged if a customer messages you directly about the job.
          </p>
        </div>
      </div>

      {/* Footer with Stripe info */}
      <div className="flex flex-col items-center justify-between gap-4">
        <p className="text-gray-900 dark:text-gray-400 text-[13px] flex items-center space-x-2 max-w-sm">
          <span>
            Yelpax partners with <strong>Stripe</strong> for secure financial services.
          </span>
        </p>
      </div>
    </div>
  );
}
