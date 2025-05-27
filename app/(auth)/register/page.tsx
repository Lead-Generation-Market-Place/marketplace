import SignUpForm from "@/components/auth/SignUpForm";
import Link from "next/link";
import React from "react";

const SignUp = async () => {
  return (
    <div className="w-full flex justify-center">
      <section className="flex flex-col w-[400px]">
        <SignUpForm />
        <div className="mt-2 flex text-gray-600 items-center justify-center">
          <p className="text-[14px]  ">Already have an account?</p>
          <Link className="font-bold ml-2 text-[14px]" href="/login">
            Sign In
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
