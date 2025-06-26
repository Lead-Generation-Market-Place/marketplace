import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/navbar";
import { Toaster } from "sonner";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <Navbar />
        {children}
                <Toaster />

        <Footer />
     </div>
  );
}
