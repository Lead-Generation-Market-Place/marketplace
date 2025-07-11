import { Briefcase, Calendar, Users, Mail, Settings, Layers } from "lucide-react";
import React from "react"; // <--- Required for using JSX in objects (icons)

export type SubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
};

export type NavItem = {
  name: string;
  path?: string;
  icon?: React.ReactNode;
  subItems?: SubItem[];
};

export const defaultNavItems: NavItem[] = [
  { name: "Sign up as a Pro", path: "/onboarding", icon: <Briefcase size={18} /> },
  { name: "Book Service", path: "/Book_Service", icon: <Calendar size={18} /> },
  { name: "Team", path: "/team", icon: <Users size={18} /> },
  { name: "Inbox", path: "/inbox", icon: <Mail size={18} /> },
];

export const serviceProviderNavItems: NavItem[] = [
  { name: "My Services", path: "/professional/servicesPro", icon: <Layers size={18} /> },
  { name: "Loads", path: "/offers", icon: <Briefcase size={18} /> },
  { name: "Inbox", path: "/inbox", icon: <Mail size={18} /> },
  { name: "Performance", path: "/performance", icon: <Settings size={18} /> },
  { name: "Calendar", path: "/calendar", icon: <Calendar size={18} /> },
  { name: "Employees", path: "/Employees", icon: <Users size={18} /> },
  { name: "Sub Contractors", path: "/contracors", icon: <Users size={18} /> },
  { name: "Profile", path: "/profile", icon: <Users size={18} /> },
];
