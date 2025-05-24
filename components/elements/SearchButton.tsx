import React from "react";

const AuthButton = ({
  type,
  loading,
}: {
  type: "Search" | "Next" ;
  loading: boolean;
}) => {
  return (
    <button
      disabled={loading}
      type="submit"
      className={`${
        loading ? "bg-[#0077B6]" : "bg-[#0096C7]"
      } w-full rounded-[2px] px-10 py-3 text-sm font-medium flex items-center justify-center gap-2 text-white bg-[#0077B6]  cursor-pointer transition-colors hover:bg-[#0096C7] hover:text-white`}
    >
      {loading ? "Loading..." : type}
    </button>
  );
};

export default AuthButton;