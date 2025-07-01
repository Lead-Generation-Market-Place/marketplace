"use client";
import Active from "@/components/plan/Active";
import Completed from "@/components/plan/Completed";
import Todos from "@/components/plan/Todos";
import { useState } from "react";

const TABS = [
  { label: "To-do's", key: "todos" },
  { label: "In Progress", key: "active" },
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
    <div
      className="
        min-h-[55vh] sm:min-h-[60vh] md:min-h-[65vh] lg:min-h-[70vh]
        flex flex-col
        bg-white dark:bg-gray-900
        transition-colors duration-300
      "
    >
      <div className="mx-auto w-full max-w-6xl px-2 sm:px-4 md:px-8">
        {/* Tabs at the very top */}
        <nav
          className="
            flex flex-row gap-2 sm:gap-5 items-center
            overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700
            pt-2
          "
          aria-label="Plan navigation"
        >
          <div className="flex-1">
            <div className="flex border-b border-gray-200 dark:border-gray-700 relative">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`
                    relative
                    text-base sm:text-lg md:text-xl px-3 py-2 sm:py-4 font-semibold
                    border-b-2 transition-colors duration-200
                    ${
                      selectedTab === tab.key
                        ? "text-sky-600 dark:text-sky-400 border-sky-500"
                        : "border-transparent text-gray-700 dark:text-gray-300"
                    }
                    bg-transparent outline-none
                    focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:rounded
                    hover:text-sky-500 dark:hover:text-sky-400
                    group
                  `}
                  type="button"
                  aria-current={selectedTab === tab.key ? "page" : undefined}
                  tabIndex={0}
                  style={{ zIndex: 1 }}
                >
                  {tab.label}
                  {/* Active underline */}
                  {selectedTab === tab.key && (
                    <span
                      className="absolute left-0 right-0 -bottom-[2px] h-0.5 bg-sky-500 dark:bg-sky-400 rounded transition-all"
                      aria-hidden="true"
                      style={{ zIndex: 2 }}
                    />
                  )}
                  {/* Hover underline, overlays border-b */}
                  <span
                    className={`
                      pointer-events-none
                      absolute left-0 right-0 -bottom-[2px] h-0.5
                      bg-sky-300 dark:bg-sky-600
                      rounded transition-all duration-200
                      opacity-0 group-hover:opacity-100
                      ${selectedTab === tab.key ? "hidden" : ""}
                    `}
                    aria-hidden="true"
                    style={{ zIndex: 2 }}
                  />
                </button>
              ))}
            </div>
          </div>
        </nav>
        <div className="mt-6">{renderTabContent()}</div>
      </div>
    </div>
  );
}