"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";


type NavLink = { href: string; label: string };

interface TabsProps {
  navLinks: NavLink[];
}

const Tabs = ({ navLinks }: TabsProps) => {
  const pathname = usePathname();

  return (
    <>
      {navLinks.map(({ href, label }: NavLink) => {
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

export default Tabs;