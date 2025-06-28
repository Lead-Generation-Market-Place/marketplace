import { getUserSession } from "@/actions/auth/auth";
import Navbar from "@/components/navbar/navbar";
import { Toaster } from "@/components/ui/sonner"; // Your custom Sonner wrapper

import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
 const response = await getUserSession();
if (response?.user) {
 redirect("/home");
}
  return (
    <>
      <Navbar />
            <Toaster /> {/* Mounted globally */}

      {children}
    </>
  );
}
