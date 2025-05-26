"use client";

import AppHeader  from "../(dashboard)/layout/AppHeader";
import AppSidebar  from "../(dashboard)/layout/AppSidebar";
import Backdrop  from "@/app/(dashboard)/layout/Backdrop";
import { useSidebar } from '@/app/(dashboard)/context/SidebarContext';



import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";



  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
          {children}
        </div>
      </div>
    </div>
  );
}
