"use client";
import React, { useState } from "react";
import { User } from "@supabase/supabase-js";

import { Dropdown } from "@/components/dashboard/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/dashboard/ui/dropdown/DropdownItem";
import { logOut } from "@/actions/auth/auth";
import {
  ChartPie,
  Puzzle,
  BarChart2,
  Star,
  DollarSign,
  CreditCard,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";

type UserProfile = {
  id: string;
  user_id: string;
  username: string;
  bio: string;
  // Add more fields based on your schema
};

interface UserDropdownProps {
  user: User | null;
  profile: UserProfile | null;
}

export default function UserDropdown({ user, profile }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname === "/";

  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await logOut();
    setLoading(false);
  };

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      {profile ? (
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
        >
          <span className="w-6 h-6 mr-1 flex items-center justify-center rounded-full bg-sky-200 text-sky-600 dark:bg-sky-900 dark:text-sky-200 font-semibold text-sm">
          {profile.username
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </span>
          <span className="block mr-1 font-medium text-theme-sm">
            {profile.username}
          </span>
        </button> 
      ) : (
        <p>Loading user...</p>
      )}

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {user && profile ? (
          <div className="p-2 border-b ">
            <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
              {profile.username}
            </span>
            <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </span>
          </div>
        ) : (
          <p>Loading user...</p>
        )}

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          {isDashboard ? (
            <li>
              <DropdownItem
                onItemClick={closeDropdown}
                tag="Link"
                href="/home"
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <ChartPie className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                Dashboard
              </DropdownItem>
            </li>
          ) : (
            ""
          )}
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="Link"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <Puzzle className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Integrations
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="Link"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <BarChart2 className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Insights
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="Link"
              href="/professional/ask-reviews/read"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <Star className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Reviews
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="Link"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <CreditCard className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Credits
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="Link"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <DollarSign className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Earnings
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="Link"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <Calendar className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Calendar
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="Link"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <Settings className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Settings
            </DropdownItem>
          </li>
        </ul>

        <form onSubmit={handleLogout}>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <LogOut  />
            {loading ? "Signing out..." : "Sign out"}
          </button>
        </form>
      </Dropdown>
    </div>
  );
}
