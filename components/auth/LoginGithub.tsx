"use client";

import { signInWithGithub } from "@/actions/auth/auth";
import React, { useTransition } from "react";
import { FaGithub } from "react-icons/fa";

const LoginGithub = () => {
  const [isPending, startTransition] = useTransition();

  const handleGithubLogin = () => {
    startTransition(async () => {
      await signInWithGithub();
    });
  };

  return (
    <div className="my-2 mx-2">
      <div
        onClick={handleGithubLogin}
        className="w-full rounded-[4px] px-12 py-2.5 text-sm font-medium flex items-center justify-center text-[#0077B6] cursor-pointer transition-colors hover:bg-[#0096C7] hover:text-white dark:text-white dark:hover:bg-[#0077B6]"
        style={{ minHeight: 40 }}
      >
        <FaGithub className="text-xl mr-2 transition-colors" />
        <span className="font-semibold">
          {isPending ? "Redirecting..." : "Login with Github"}
        </span>
      </div>
    </div>
  );
};

export default LoginGithub;
