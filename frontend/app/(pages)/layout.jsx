"use client";

import SideBar from "../../components/global/SideBar";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import {PhoneIncoming, Phone} from "lucide-react";
import {usePathname} from "next/navigation";
import {CallProvider} from "@/components/provider/CallProvider";

const RootLayout = ({ children }) => {

  const path = usePathname()

  return (
    <>
      <HeroUIProvider className="w-full">
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <CallProvider>
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
                  <div
                      className="hidden fixed bottom-5 w-60 right-5 bg-black/70 border-2 border-solid border-neutral-500 p-4 shadow-lg rounded-lg flex flex-col items-center
                 animate-fadeInUp"
                  >
                    <p className="text-lg font-semibold ">{name} is calling...</p>
                    <div className="mt-3 flex gap-8">
                      <button
                          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors">
                        <PhoneIncoming size={20}/>
                      </button>
                      <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors">
                        <Phone size={20}/>
                      </button>
                    </div>
                  </div>
                </main>
              </div>
            </CallProvider>
          </NextThemesProvider>
      </HeroUIProvider>
    </>
  );
};

export default RootLayout;
