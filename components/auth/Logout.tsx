"use client";
import { logOut } from "@/actions/auth";
import React, { useState } from "react";

const Logout = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await logOut()

    setLoading(false);
  };

  return (
    <div className="my-2 mx-2">
      <form onSubmit={handleLogout}>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[4px] px-6 py-2 text-sm font-medium flex items-center justify-center bg-white text-[#0077B6] cursor-pointer transition-colors hover:bg-[#0096C7] hover:text-white"
          style={{ minHeight: 40 }}
        >
          {loading ? "Signing out..." : "Sign out"}
        </button>
      </form>
    </div>
  );
};

export default Logout;
