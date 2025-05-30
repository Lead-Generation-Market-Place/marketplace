import Link from "next/link";
import MobileMenu from "./mobileMenu";
import DropdownMenu from "./DropdownMenu";
import { createClient } from "@/utils/supabase/server";
import Logout from "../auth/Logout";
import Image from "next/image";

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
  return (
    <header className="w-full bg-white text-gray-800 border-b border-gray-200 font-sans z-50 relative">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-semibold">
          <Image src="/us-connector.png" alt="US Connector Logo" width={60} height={8} />
        </Link>

        {/* Mobile Menu (Client Component) */}
        <div className="md:hidden">
          <MobileMenu dropdownData={dropdownData} />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm relative z-50">
          {Object.entries(dropdownData).map(([label, items]) => (
            <DropdownMenu key={label} label={label} items={items} />
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4 text-sm">
          {!user ? (
            <>
              <Link href="/login" className="hover:text-[#023E8A]">
                Login
              </Link>
              <Link href="/about" className="hover:text-[#023E8A]">
                Contact Sales
              </Link>
              <Link
                href="/register"
                className="bg-[#0077B6] hover:bg-[#0096C7] text-white px-4 py-2 rounded-[4px] transition"
              >
                Get started — Join as Pro
              </Link>
              
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-[#023E8A]">
                {user.email}
              </Link>
              <Logout />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
