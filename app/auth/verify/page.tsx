"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { verifyOtp, login } from "@/lib/utils/auth-helpers";

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setError(null);

    const email = sessionStorage.getItem("email")!;
    const password = sessionStorage.getItem("password")!;

    try {
      await verifyOtp(email, otp);
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Verify Your Email</h2>
        <p className="text-sm text-center text-gray-500">
          We have sent a verification code to your email.
        </p>

        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
            Enter OTP Code
          </label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-lg shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otp.length === 0}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
}
