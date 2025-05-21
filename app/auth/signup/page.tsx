"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RulesValidation } from "@/lib/rules";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import { Github } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
type FormData = z.infer<typeof RulesValidation>;
export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(RulesValidation),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      sessionStorage.setItem("email", data.email);
      sessionStorage.setItem("password", data.password);
      router.push("/auth/verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center mt-4 bg-gray-50 px-4">
      {/* Logo */}
   
      <div className="w-full max-w-md bg-white rounded-[8px] px-8 py-8 shadow-md">
           <div className="flex flex-col items-center mb-4">
        <h2 className=" text-2xl font-bold text-center text-gray-900">Sign in to your account</h2>
      </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-[14px]">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.email && (
              <ul className="mt-1 text-sm text-red-500 list-disc list-inside">
                <li>{errors.email.message}</li>
              </ul>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register("password")}
              id="password"
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.password && (
              <ul className="mt-1 text-sm text-red-500 list-disc list-inside">
                <li>{errors.password.message}</li>
              </ul>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              id="confirmPassword"
              type="password"
              name ="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <ul className="mt-1 text-sm text-red-500 list-disc list-inside">
                <li>{errors.confirmPassword.message}</li>
              </ul>
            )}
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember" name="remember" type="checkbox" className="h-4 w-4  border-gray-300 rounded" />
              <label htmlFor="remember" className=" ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className=" bg-[#0077B6] hover:bg-[#0096C7] w-full py-2 text-white font-semibold rounded-[4px] transition disabled:opacity-50"
          >
            {isLoading ? "Signing up..." : "Sign in"}
          </button>

          {/* Divider */}
          <div className="flex items-center ">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-gray-400 text-sm">Or continue with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Social Buttons */}
          <div className="flex gap-4">
            <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 hover:bg-gray-50 transition">
             <FaGoogle size={20} />
              Google
            </button>
            <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 hover:bg-gray-50 transition">
              <Github size={20} />
              GitHub
            </button>
          </div>
        </form>
        {error && <p className="text-sm text-center text-red-600 mt-4">{error}</p>}
        <p
          onClick={() => router.push("/auth/login")}
          className="text-center text-sm text-[#0077B6] hover:text-[#0096C7] mt-4 hover:underline cursor-pointer"
        >
          Already have an account? Sign in
        </p>
      </div>
    </div>
  );
}

export default SignUp;
