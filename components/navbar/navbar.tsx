import Link from "next/link";
import MobileMenu from "./mobileMenu";
import DropdownMenu from "./DropdownMenu";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { ThemeToggleButton } from "@/components/dashboard/Themes/ThemeToggleButton";

import { defaultNavItems, serviceProviderNavItems} from "@/app/(dashboard)/data/NavItems";
import { Suspense, lazy } from "react";

// Lazy load the ProDropdown component
const ProDropdown = lazy(() => import("@/components/dashboard/header/UserDropdown"));


import Tabs from "./Tabs";

const dropdownData = {
  Explore: ["Overview", "Pricing", "Features"],
  Marketplace: ["Browse", "Top Rated", "Categories"],
  Learn: ["Tutorials", "Guides", "Webinars"],
  Resources: ["Blog", "Help Center", "Contact"],
};


const Navbar = async () => {
  
  
  const supabase = await createClient();
const {
  data: { user },
} = await supabase.auth.getUser();

const userId = user?.id;

let isServiceProvider = false;

if (userId) {
  const { data, error } = await supabase
    .from("service_providers")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (data && !error) {
    isServiceProvider = true;
  }
}

const navItems = isServiceProvider
  ? serviceProviderNavItems
  : defaultNavItems;

  return (
    <header className="w-full bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800 font-sans z-50 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-semibold flex items-center">
          <Image src="/yelpax.png" alt="Yelpax Logo" width={120} height={10} />
        </Link>

        {/* Mobile Menu (Client Component) */}
        <div className="md:hidden">
          <MobileMenu dropdownData={dropdownData} />
        </div>

        {/* Desktop Navigation */}
        {!user ? (
          <nav className="hidden md:flex items-center space-x-6 text-sm relative z-50">
            {Object.entries(dropdownData).map(([label, items]) => (
              <DropdownMenu key={label} label={label} items={items} />
            ))}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center space-x-6 text-xs relative z-50">
            <Tabs navLinks={navItems.map(item => ({
              href: item.path || "#", // fallback for undefined path
              label: item.name
            }))} />

          </nav>
        )}


        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4 text-sm font-light">


          {!user ? (
            <>
              <Link href="/login" className="hover:text-[#023E8A] dark:hover:text-[#90e0ef] transition-colors">
                Login
              </Link>
              <Link href="/about" className="hover:text-[#023E8A] dark:hover:text-[#90e0ef] transition-colors">
                Contact Sales
              </Link>
              <Link
                href="/register"
                className="bg-[#0077B6] hover:bg-[#0096C7] dark:bg-[#023E8A] dark:hover:bg-[#0077B6] text-white px-4 py-2 rounded-[4px] transition"
              >
                Get started — Join as Pro
              </Link>
            </>
          ) : (
            <>
              {/* User actions here */}
              {user && (
                <Suspense fallback={<div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />}>
                  <ProDropdown />
                </Suspense>


              )}
            </>
          )}
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;