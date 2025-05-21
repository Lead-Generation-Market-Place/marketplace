'use client';

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface DropdownMenuProps {
  label: string;
  items: string[];
}

export default function DropdownMenu({ label, items }: DropdownMenuProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div key={label} className="relative" ref={dropdownRef}>
      <button
        onClick={() => toggleDropdown(label)}
        className="flex items-center gap-1 hover:text-[#023E8A] transition"
        type="button"
      >
        {label}
        <ChevronDown size={14} />
      </button>
      {openDropdown === label && (
        <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg min-w-[160px] z-50">
          <ul className="text-sm py-2">
            {items.map((item) => (
              <li key={item}>
                <Link
                  href={`/${label.toLowerCase()}/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpenDropdown(null)} // Close after click
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
