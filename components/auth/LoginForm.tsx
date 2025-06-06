"use client";

import React, { useState } from "react";
import AuthButton from "@/components/auth/AuthButton";
import { signIn } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner"; // ✅ Use Sonner toast

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn(formData);

    if (result.status === "success") {
      router.push("/home");
    } else {
      toast.error("Login Failed", {
        description: result.status,
      });
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="flex min-h-full flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">Email</label>
              <div className="mt-2">
                <input
                  type="text"
                  name="email"
                  id="email"
                  required
                  className="block w-full rounded-[4px] bg-white px-3 py-2.5 text-sm font-medium text-[#0077B6] border border-[#0077B6] focus:outline-none focus:ring-1 focus:ring-[#0077B6]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm/6 font-medium text-gray-900">Password</label>
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-semibold text-[#0077B6] hover:text-[#0096C7]">
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
                  className="block w-full rounded-[4px] bg-white px-3 py-2.5 text-sm font-medium text-[#0077B6] border border-[#0077B6] focus:outline-none focus:ring-1 focus:ring-[#0077B6]"
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
