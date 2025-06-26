'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, User, Lock } from 'lucide-react';

interface ReviewDialogProps {
  step: 1 | 2;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  errors: { firstName?: string; lastName?: string; email?: string };
  passwordError: string | null;
  isPending: boolean;
  isCheckingEmail: boolean;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  onStepBack: () => void;
}

const ReviewDialog = React.memo(function ReviewDialog({
  step,
  firstName,
  lastName,
  email,
  password,
  errors,
  passwordError,
  isPending,
  isCheckingEmail,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirm,
  onCancel,
  onStepBack,
}: ReviewDialogProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm();
  };

  // Helper function to determine input styling based on errors
  const getInputClasses = (hasError: boolean | undefined) => {
    const baseClasses = "mt-2 block w-full rounded-[2px] bg-white dark:bg-gray-900 px-10 py-1.5 text-base text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 sm:text-sm";
    return hasError 
      ? `${baseClasses} border-red-500 text-red-900 placeholder-red-700 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500`
      : baseClasses;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <h2 className="text-lg font-normal mb-6 text-gray-900 dark:text-white">
      </h2>

      {step === 1 ? (
        <div className="space-y-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => onFirstNameChange(e.target.value)}
                className={getInputClasses(!!errors.firstName)}
                placeholder="John"
                required
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => onLastNameChange(e.target.value)}
                className={getInputClasses(!!errors.lastName)}
                placeholder="Doe"
                required
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className={getInputClasses(!!errors.email)}
                placeholder="john@example.com"
                required
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                {errors.email}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Password Step */
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className={getInputClasses(!!passwordError)}
              placeholder="••••••••"
              required
            />
          </div>
          {passwordError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              {passwordError}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          type="button"
          onClick={step === 1 ? onCancel : onStepBack}
          disabled={isPending || isCheckingEmail}
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white text-[13px] py-2 px-5 rounded-[4px] font-medium hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>
        <Button 
          type="submit"
          disabled={isPending || isCheckingEmail}
          className={`
            text-white text-[13px] py-2 px-6 rounded-[4px]
            transition duration-300 flex items-center justify-center gap-2
            ${isPending ? 'bg-[#0077B6]/70 cursor-not-allowed' : 'bg-[#0077B6] hover:bg-[#005f8e]'}
          `}
        >
          {(isPending || isCheckingEmail) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            step === 1 ? 'Continue' : 'Submit Review'
          )}
        </Button>
      </div>
    </form>
  );
});

ReviewDialog.displayName = 'ReviewDialog';

export default ReviewDialog;