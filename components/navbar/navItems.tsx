"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/home", label: "Sign Up as Pro" },
  { href: "/team", label: "My Pro Team" },
  { href: "/plan", label: "Plan" },
  { href: "/inbox", label: "Message" },
];

const NavItems = () => {
  const pathname = usePathname();

  return (
    <>
      {navLinks.map(({ href, label }) => {
        // Normalize trailing slash for comparison
        const isActive =
          pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

        return (
          <Link
            key={href}
            href={href}
            className={`${
              isActive ? "text-sky-500 font-bold" : ""
            }hover:text-sky-600 dark:hover:text-600 transition-colors`}>
            {label}
          </Link>
        );
      })}
    </>
  );
};

export default NavItems;