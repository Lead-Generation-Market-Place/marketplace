"use client";

import React, { useState } from "react";
import AuthButton from "@/components/auth/AuthButton";
import { signIn } from "@/actions/auth/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await signIn(formData);

      if (result.status !== "success") {
        toast.error("Login failed", {
          description: result.status || "Invalid credentials.",
        });
        return;
      }
      router.push("/home");

    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex min-h-full flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <div className="mt-2">
                <input
                  type="text"
                  name="email"
                  id="email"
                  required
                  className="block w-full rounded bg-white dark:bg-gray-800 px-3 py-2.5 text-sm font-medium text-[#0077B6] dark:text-[#90E0EF] border border-[#0077B6] dark:border-[#90E0EF] focus:outline-none focus:ring-1 focus:ring-[#0077B6] dark:focus:ring-[#90E0EF]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Password</label>
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-semibold text-[#0077B6] hover:text-[#0096C7] dark:text-[#90E0EF] dark:hover:text-[#00B4D8]"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  className="block w-full rounded bg-white dark:bg-gray-800 px-3 py-2.5 text-sm font-medium text-[#0077B6] dark:text-[#90E0EF] border border-[#0077B6] dark:border-[#90E0EF] focus:outline-none focus:ring-1 focus:ring-[#0077B6] dark:focus:ring-[#90E0EF]"
                />
              </div>
            </div>

            <div className="mt-2">
              <AuthButton type="login" loading={loading} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
