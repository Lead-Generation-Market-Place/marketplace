"use client";
import Active from "@/components/plan/Active";
import Completed from "@/components/plan/Completed";
import Todos from "@/components/plan/Todos";
import { useState } from "react";

const TABS = [
  { label: "To-do's", key: "todos" },
  { label: "Active", key: "active" },
  { label: "Completed", key: "completed" }
];

export default function Plan() {
  // Set 'active' as default
  const [selectedTab, setSelectedTab] = useState("active");

  // Render the correct component based on the selected tab
  function renderTabContent() {
    switch (selectedTab) {
      case "todos":
        return <Todos />;
      case "active":
        return <Active />;
      case "completed":
        return <Completed />;
      default:
        return null;
    }
  }

  return (
    <div className="
        min-h-[50vh]
        sm:min-h-[55vh]
        md:min-h-[60vh]
        lg:min-h-[65vh]
        xl:min-h-[70vh]
        flex flex-col justify-center 
        bg-white dark:bg-gray-900 
        transition-colors duration-300
    ">
      <div className="
        mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-12 2xl:mx-16
      ">
        <div className="flex flex-row gap-5 items-center border-b border-gray-200 dark:border-gray-700">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`
                text-xl py-4 font-semibold
                border-b-2 transition-colors duration-200
                ${selectedTab === tab.key
                  ? "text-sky-500 border-sky-500"
                  : "border-transparent hover:text-sky-500 hover:border-sky-500 focus:text-sky-500 focus:border-sky-500"
                }
                bg-transparent
                outline-none
              `}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}