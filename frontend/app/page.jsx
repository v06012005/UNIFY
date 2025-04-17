import Post from "@/components/global/Post";
import avatar from "@/public/images/unify_icon_2.svg";
import Image from "next/image";
import fullLogo from "@/public/images/unify_1.svg";
import RootLayout from "./(pages)/layout";
import Link from "next/link";
import FullUnifyLogo from "@/components/global/FullUnifyLogo";
import { fetchPosts, verifySession } from "./lib/dal";
import { getQueryClient } from "@/app/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { useApp } from "@/components/provider/AppProvider";

const SearchBar = () => {
  return (
    <>
      <form action="#">
        <div className="mt-2">
          <div className="flex border items-center rounded-md bg-white pl-3 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2">
            <input
              type="search"
              name="search"
              id="search"
              className="block text-wrap min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-90 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
              placeholder="Search"
            />
          </div>
        </div>
      </form>
    </>
  );
};

// const checkAuth = async () => {
//   const session = await verifySession();
//   if (!session) return null;

//   return session;
// }

const User = ({ href = "" }) => {
  return (
    <Link href={href}>
      <div className="flex mb-2">
        <Image
          src={avatar}
          alt="Avatar"
          className="rounded-full border-1 dark:border-neutral-700 border-gray-300 w-12 h-12"
        />
        <div className="ml-5">
          <p className="my-auto text-sm font-bold">@username</p>
          <p className="my-auto">Johnny Dang</p>
        </div>
      </div>
    </Link>
  );
};

export default async function Home() {
  const session = await verifySession();
  return (
    <RootLayout>
      <div className="flex">
        <div className="basis-3/4 py-8 h-screen overflow-y-scroll no-scrollbar">
          <div className="w-4/4 flex flex-col mx-3">
            <Post />
          </div>
        </div>
        <div className="basis-1/4 border-l-1 dark:border-neutral-700 py-8 h-screen sticky top-0">
          <div className="w-3/4 flex flex-col mx-auto">
            {session?.isAuth && <User href="/profile" />}
            <hr className="my-4 dark:border-neutral-700" />
            <div>
              <p className="font-bold text-lg mb-4">Group suggestions</p>
              <User href="/profile" />
              <User href="/" />
              <User href="/" />
              <User href="/" />
              <User href="/" />
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
    </RootLayout>
  );
}
