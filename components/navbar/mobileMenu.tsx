// app/components/MobileMenu.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

export default function MobileMenu({
  dropdownData,
}: {
  dropdownData: Record<string, string[]>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isOpen && (
        <div className="md:hidden px-4 pb-6 pt-4 space-y-4 bg-white  shadow-md absolute left-0 right-0 top-full z-40">
          {Object.entries(dropdownData).map(([label, items]) => (
            <div key={label}>
              <button
                onClick={() => toggleDropdown(label)}
                className="w-full flex justify-between items-center font-medium hover:text-[#023E8A]"
              >
                {label}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${openDropdown === label ? "rotate-180" : ""}`}
                />
              </button>
              {openDropdown === label && (
                <ul className="mt-2 space-y-1 pl-4 border-l border-gray-200 text-sm">
                  {items.map((item) => (
                    <li key={item}>
                      <Link
                        href={`/${label.toLowerCase()}/${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block py-1 hover:text-[#023E8A]"
                        onClick={() => setIsOpen(false)}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div className="pt-4 border-t space-y-2 text-sm">
            <Link href="/login" onClick={() => setIsOpen(false)} className="block">Login</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="block">Contact Sales</Link>
            <Link
              href="/auth/signup"
              className="block bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
                          Get started — Join as Pro

            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
