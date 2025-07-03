import SignUpForm from "@/components/auth/SignUpForm";
import Link from "next/link";
import React from "react";

const SignUp = async () => {
  return (
    <div className="w-full flex justify-center bg-white text-black dark:bg-gray-900 dark:text-white">
      <section className="flex flex-col w-[400px] p-4">
        <SignUpForm />
        <div className="mt-2 flex text-gray-600 dark:text-gray-300 items-center justify-center">
          <p className="text-[14px]">Already have an account?</p>
          <Link className="font-bold ml-2 text-[14px] text-[#0077B6] dark:text-[#38bdf8]" href="/login">
            Sign In
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
