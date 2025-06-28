"use client";
import React, { useState } from "react";
import AuthButton from "../auth/AuthButton";
import { useRouter } from "next/navigation";
import { signUp } from "@/actions/auth/auth";
import { toast } from "sonner"; // ✅ Use Sonner toast

const SignUpForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await signUp(formData);
    if (result.status === "success") {
      router.push("/login");
    } else {
      toast.error("Register Failed", {
        description: result.status,
      });
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Create an account
        </h2>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Username"
                id="username"
                name="username"
                
                className="block w-full rounded-[4px] bg-white px-6 py-2.5 text-sm font-medium text-[#0077B6] border border-[#0077B6] focus:outline-none focus:ring-1 focus:ring-[#0077B6]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Email
            </label>
            <div className="mt-2">
              <input
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                
                className="block w-full rounded-[4px] bg-white px-6 py-2.5 text-sm font-medium text-[#0077B6] border border-[#0077B6] focus:outline-none focus:ring-1 focus:ring-[#0077B6]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                placeholder="Password"
                name="password"
                id="password"
                
                minLength={8}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$"
                title="Password must be at least 8 characters long and include uppercase, lowercase, and a symbol"
                className="block w-full rounded-[4px] bg-white px-6 py-2.5 text-sm font-medium text-[#0077B6] border border-[#0077B6] focus:outline-none focus:ring-1 focus:ring-[#0077B6]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                id="confirmPassword"
                
                className="block w-full rounded-[4px] bg-white px-6 py-2.5 text-sm font-medium text-[#0077B6] border border-[#0077B6] focus:outline-none focus:ring-1 focus:ring-[#0077B6]"
              />
            </div>
          </div>

          <div className="mt-2">
            <AuthButton type="Sign up" loading={loading} />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
