import Post from "@/components/global/Post";
import avatar from "@/public/images/unify_icon_2.svg";
import Image from "next/image";
import fullLogo from "@/public/images/unify_1.svg";
import RootLayout from "./(pages)/layout";
import Link from "next/link";
import FullUnifyLogo from "@/components/global/FullUnifyLogo";
import SuggestedUsers from "@/components/global/TabProfile/SuggestedUsers";

export default async function Home() {

  return (
    <RootLayout>
      <div className="flex">
        <div className="basis-3/4 h-screen">
          <div id="newsfeed" className="h-full py-8 overflow-y-scroll no-scrollbar">
            <div className="w-3/4 flex flex-col mx-auto">
              <Post />
            </div>
          </div>
        </div>
        <div className="basis-1/4 border-l-1 dark:border-neutral-700 py-8 h-screen sticky top-0">
          <div className="w-3/4 flex flex-col mx-auto">
            <div>
              <p className="font-bold text-xl mb-8">People you may know</p>
              <div className="max-h-[460px] overflow-y-auto no-scrollbar pr-1">
              <SuggestedUsers />
              </div>
            </div>
            <hr className="my-4 dark:border-neutral-700" />
            <div>
              <FullUnifyLogo className="w-1/2" />
              <p className="mt-2 text-zinc-500">
                &copy; UNIFY FROM WORKAHOLICS
              </p>
            </div>
          </div>
        </div>
      </div>
    </RootLayout >
  );
}
