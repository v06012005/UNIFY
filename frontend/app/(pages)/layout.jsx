"use client";

import SideBar from "../../components/global/SideBar";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const RootLayout = ({ children }) => {
  return (
    <>
      <HeroUIProvider className="w-full">
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <div className="flex w-full light text-foreground bg-background dark:bg-black">
            <aside className="w-20 z-50 flex-none">
              <div className={`w-20 fixed`}>
                <SideBar />
              </div>
            </aside>
            <main className="w-full flex-initial z-10">{children}</main>
          </div>
        </NextThemesProvider>
      </HeroUIProvider>
    </>
  );
};

export default RootLayout;
