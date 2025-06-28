"use client";

import React, { useState, useEffect } from "react";
import AuthButton from "../auth/AuthButton";
import { useRouter, useSearchParams } from "next/navigation";
import { resetLink } from "@/actions/auth/auth";
import { toast } from "sonner";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // 🛠 Move searchParams to client-only useEffect
  useEffect(() => {
    const codeParam = searchParams.get("code");
    setCode(codeParam);
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    if (!code) {
      toast.error("Missing code");
      setLoading(false);
      return;
    }

    const result = await resetLink(formData, code);

    if (result.status === "success") {
      router.push("/");
    } else {
      toast.error("Reset Password Failed", {
        description: result.status,
      });
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="flex min-h-full flex-col justify-center ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password.
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">New Password</label>
              <div className="mt-2">
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  name="password"
                  required
                  className="block w-full rounded-[4px] bg-white px-3 py-2.5 text-sm font-medium text-[#0077B6] border border-[#0077B6] focus:outline-none focus:ring-1 focus:ring-[#0077B6]"
                />
              </div>
            </div>
            <div className="mt-2">
              <AuthButton type="Reset Password" loading={loading} />
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
