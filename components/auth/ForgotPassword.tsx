"use client";
import React, { useState } from "react";
import AuthButton from "@/components/auth/AuthButton";
import { UnPassword } from "@/actions/auth";
import { toast } from "sonner"; // ✅ Use Sonner toast

const ForgotPassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget)
    const result = await UnPassword(formData)
    if(result.status ==='success') {
        toast.success("Reset Password Sent Successfully!");
    } else {
        toast.error("Failed to send reset link", {
          description: result.status || "Unknown error"
        });
        setError(result.status || "Unknown error");
    }
    setLoading(false);
  };
return (
  <div>
    <div className="flex min-h-full flex-col justify-center ">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Forgot Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">

          Enter your email and we will send you a reset link.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm/6 font-medium text-gray-900">Email</label>
            <div className="mt-2">
              <input
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                required
                className="block w-full rounded-[4px] bg-white px-3 py-2.5 text-sm font-medium text-[#0077B6] border border-[#0077B6] focus:outline-none focus:ring-1 focus:ring-[#0077B6]"
              />
            </div>
          </div>
          <div className="mt-2">
            <AuthButton type="Forgot Password" loading={loading} />
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  </div>
);
};

export default ForgotPassword;
