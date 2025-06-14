"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/app/(dashboard)/context/SidebarContext";

import { Briefcase, Calendar, Users, Mail } from "lucide-react";

type SubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
};

type NavItem = {
  name: string;
  path?: string;
  icon?: React.ReactNode;
  subItems?: SubItem[];
};

const navItems: NavItem[] = [
  {
    name: "Professional",
    // ↓ drop the trailing slash here
    path: "/professional",
    icon: <Briefcase size={18} />,
  },
  {
    name: "Plan",
    path: "/plan",
    icon: <Calendar size={18} />,
  },
  {
    name: "Team",
    path: "/team",
    icon: <Users size={18} />,
  },
  {
    name: "Inbox",
    path: "/Inbox",
    icon: <Mail size={18} />,
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{ type: string; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // isActive now correctly matches "/professional" or any "/professional/..."
  const isActive = useCallback((path: string) => {
    if (!path) return false;
    return pathname === path || pathname.startsWith(`${path}/`);
  }, [pathname]);

  useEffect(() => {
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((sub) => {
          if (isActive(sub.path)) {
            setOpenSubmenu({ type: "main", index });
          }
        });
      }
    });
  }, [pathname]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const element = subMenuRefs.current[key];
      if (element) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: element.scrollHeight,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, type: string) => {
    setOpenSubmenu((prev) =>
      prev && prev.type === type && prev.index === index ? null : { type, index }
    );
  };

  const renderMenuItems = (items: NavItem[], type: string) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        const key = `${type}-${index}`;
        const hasSubmenuOpen = openSubmenu?.type === type && openSubmenu?.index === index;

        // <-- this will be true whenever you're at "/professional" OR anything under "/professional/..."
        const active = nav.path ? isActive(nav.path) : false;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, type)}
                className={`
                  menu-item group
                  ${hasSubmenuOpen ? "menu-item-active" : "menu-item-inactive"}
                  ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}
                `}
              >
                {nav.icon && <span className="mr-3 text-gray-500">{nav.icon}</span>}
                {(isExpanded || isHovered || isMobileOpen) && <span>{nav.name}</span>}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span
                    className={`
                      ml-auto transition-transform duration-200
                      ${hasSubmenuOpen ? "rotate-180" : ""}
                    `}
                  >
                    ▼
                  </span>
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`
                    menu-item group
                    ${active ? "menu-item-active" : "menu-item-inactive"}
                    ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}
                  `}
                >
                  {nav.icon && <span className="mr-3 text-gray-500">{nav.icon}</span>}
                  {(isExpanded || isHovered || isMobileOpen) && <span>{nav.name}</span>}
                </Link>
              )
            )}

            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[key] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: hasSubmenuOpen ? `${subMenuHeight[key] || 0}px` : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((sub) => (
                    <li key={sub.name}>
                      <Link
                        href={sub.path}
                        className={`
                          menu-dropdown-item
                          ${isActive(sub.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"}
                        `}
                      >
                        {sub.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {sub.new && (
                            <span
                              className={`
                                menu-dropdown-badge
                                ${isActive(sub.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"}
                              `}
                            >
                              new
                            </span>
                          )}
                          {sub.pro && (
                            <span
                              className={`
                                menu-dropdown-badge
                                ${isActive(sub.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"}
                              `}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`
        fixed mt-16 lg:mt-0 top-0 left-0 z-50 h-screen px-5
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        text-gray-900 transition-all duration-300 ease-in-out
        ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/" className="flex items-center justify-center w-full">
          <div className="relative w-36 h-10 mx-auto">
            <Image src="/yelpax.png" alt="Logo" fill style={{ objectFit: "contain" }} priority />
          </div>
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {renderMenuItems(navItems, "main")}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
