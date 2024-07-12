// components/ClientLayout.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PopupWidget } from "@/components/PopupWidget";
import { usePathname } from 'next/navigation';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  
  // 检查当前路径是否是主页
  const isHomePage = pathname === '/' || '/waitlist';

  return (
    <div className={inter.className}>
      <ThemeProvider attribute="class">
        {isHomePage && <Navbar />}
        <div>{children}</div>
        {isHomePage && <Footer />}
        {isHomePage && <PopupWidget />}
      </ThemeProvider>
    </div>
  );
};

export default ClientLayout;
