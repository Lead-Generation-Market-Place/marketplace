import React from "react";

const ResetButton = ({
  type,
  loading,
}: {
  type: "Back" | "Reset" | "Skip" ;
  loading: boolean;
}) => {
  return (
    <button
      disabled={loading}
      type="reset"
      className={`${
        loading ? "bg-gray-300" : "bg-gray-200"
      } w-full rounded-[2px] px-10 py-3 text-sm font-medium flex items-center justify-center gap-2 text-gray-700 bg-gray-300  cursor-pointer transition-colors hover:bg-gray-200 hover:text-gray-500`}
    >
      {loading ? "Loading..." : type}
    </button>
  );
};

export default ResetButton;