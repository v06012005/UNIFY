"use client";

import SideBar from "../../components/global/SideBar";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import {usePathname} from "next/navigation";
import {CallProvider, useCall} from "@/components/provider/CallProvider";
import CallNotification from "@/components/global/chat/CallNotification";

const RootLayout = ({ children }) => {

  const path = usePathname();

  return (
    <>
    <CallProvider>
      <HeroUIProvider className="w-full">
          <NextThemesProvider attribute="class" defaultTheme="dark">
              <div className="flex w-full light text-foreground bg-background dark:bg-black">
                {
                    path !== '/video-call' && (
                        <aside className="w-20 z-50 flex-none">
                          <div className={`w-20 fixed`}>
                            <SideBar/>
                          </div>
                        </aside>
                    )
                }
                <main className="w-full flex-initial z-10 relative">
                  {children}
                  <CallNotification/>
                </main>
              </div>
          </NextThemesProvider>
      </HeroUIProvider>
    </CallProvider>
    </>
  );
};

export default RootLayout;
