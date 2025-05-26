import { getUserSession } from "@/actions/auth";
import Navbar from "@/components/navbar/navbar";
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
      {children}
    </>
  );
}
