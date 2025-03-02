import Post from "@/components/global/Post";
import avatar from "@/public/images/test1.png";
import Image from "next/image";
import fullLogo from "@/public/images/unify_1.svg";
import RootLayout from "./(pages)/layout";
import Link from "next/link";
import FullUnifyLogo from "@/components/global/FullUnifyLogo";
import {fetchPosts, verifySession} from "./lib/dal";
import {getQueryClient} from "@/app/lib/get-query-client";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";

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
      <div className="flex mb-4">
        <Image src={avatar} alt="Avatar" className="rounded-full w-14 h-14" />
        <div className="ml-5">
          <p className="my-auto text-lg font-bold">@username</p>
          <p className="my-auto">Johnny Dang</p>
        </div>
      </div>
    </Link>
  );
};

export default async function Home() {

  const session = await verifySession();
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RootLayout>
        <div className="flex">
          <div className="basis-3/4 border-r py-8 h-screen overflow-y-scroll no-scrollbar">
            <div className="w-3/4 flex flex-col mx-auto">
              <Post/>
            </div>
          </div>
          <div className="basis-1/4 border py-8 h-screen sticky top-0">
            <div className="w-3/4 flex flex-col mx-auto">
              {session?.isAuth && <User href="/profile" />}
              <div className="flex justify-center">
                {/* <Link
                className="border hover:bg-red-500 transition ease-in-out duration-100 hover:text-white rounded w-20 text-center py-2 mx-2"
                href={"/manage/users/list"}
              >
                Admin
              </Link>
              <Link
                className="border hover:bg-blue-500 transition ease-in-out duration-100 hover:text-white rounded w-20 text-center py-2 mx-2"
                href={"/login"}
              >
                Login
              </Link>
              <Link
                className="border hover:bg-blue-600 rounded bg-blue-500 text-white w-20 text-center py-2 mx-2"
                href={"/register"}
              >
                Register
              </Link> */}
              </div>
              <hr className="my-4" />
              <div>
                <p className="font-bold text-xl mb-4">Your Friends</p>
                <User href="/profile" />
                <User href="/" />
                <User href="/" />
                <User href="/" />
                <User href="/" />
              </div>
              <hr className="my-4" />
              <div>
                <FullUnifyLogo className="w-1/2" />
                <p className="mt-2 text-gray-500">
                  &copy; UNIFY FROM WORKAHOLICS
                </p>
              </div>
            </div>
          </div>
        </div>
      </RootLayout>
    </HydrationBoundary>
  );
}
