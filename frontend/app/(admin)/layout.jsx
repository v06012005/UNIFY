"use client";

import AdminSidebar from "@/components/global/AdminSidebar";
import React from "react";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

const layout = ({ children }) => {
  return (
    <HeroUIProvider className="w-full">
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <div className={`flex w-full light text-foreground bg-background dark:bg-black ${roboto.className}`}>
          <aside className="w-60 z-50 flex-none">
            <AdminSidebar />
          </aside>
          <main className="w-full flex-initial z-10 pl-5">{children}</main>
        </div>
      </NextThemesProvider>
    </HeroUIProvider>
  );
};

export default layout;
