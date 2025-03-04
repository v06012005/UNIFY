"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProfileTabs from "@/components/global/TabProfile/Tabs";
import { useApp } from "@/components/provider/AppProvider";
import FollowButton from "@/components/ui/follow-button";
import { useReports } from "@/components/provider/ReportProvider";
import { addToast, ToastProvider } from "@heroui/toast";
const NavButton = ({ iconClass, href = "", content = "", onClick }) => {
  return (
    <Link
      className="flex h-full items-center text-center"
      href={href}
      onClick={onClick}
    >
      <i className={`${iconClass}`}></i>
      <span className="">{content}</span>
    </Link>
  );
};
const Page = () => {
  const { createPostReport, createUserReport, createCommentReport } =
    useReports();
  const [activeTab, setActiveTab] = useState("post");
  const [userInfo, setUserInfo] = useState(null);
  const [userReels, setUserReels] = useState([]);
  const params = useParams();
  const { user, getUserInfoByUsername } = useApp();
  const [loading, setLoading] = useState(true);
  const [openList, setOpenList] = useState(false);

  useEffect(() => {
    if (params) {
      getUserInfoByUsername(params.username)
        .then((data) => {
          setUserInfo(data);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [params]);

  const handleReportUser = useCallback(
    async (data) => {
      const report = await createUserReport(data);

      if (report?.error) {
        const errorMessage = report.error;
        console.warn("Failed to report post:", errorMessage);

        if (errorMessage === "You have reported this content before.") {
          addToast({
            title: "Fail to report user",
            description: "You have reported this content before.",
            timeout: 3000,
            shouldShowTimeoutProgess: true,
            color: "warning",
          });
          setOpenList(false);
        } else {
          addToast({
            title: "Encountered an error",
            description: "Error: " + errorMessage,
            timeout: 3000,
            shouldShowTimeoutProgess: true,
            color: "danger",
          });
          setOpenList(false);
        }
        return;
      }

      addToast({
        title: "Success",
        description: "Report user successful.",
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "success",
      });
      setOpenList(false);
    },
    [createUserReport]
  );

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <ToastProvider placement={"top-right"} />
      <div className="h-screen overflow-y-auto">
        <div className=" w-[82%] mx-auto">
          <div className="flex p-5 mx-20">
            <div className="relative w-[200px] h-[200px] overflow-hidden rounded-full border-2 border-gray-300">
              {userInfo?.avatar?.url ? (
                <Image
                  src={userInfo.avatar.url}
                  alt="Avatar"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src="/images/unify_icon_2.svg"
                  alt="Default Avatar"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="p-2 ml-8">
              <div className="flex justify-between ml-10">
                <div className="flex flex-col items-center w-200 mt-2 mx-8">
                  <h3 className="text-2xl truncate w-32 text-center">
                    {userInfo.username}
                  </h3>
                  <p className="mt-5 text-gray-500 dark:text-gray-300 font-bold cursor-pointer">
                    posts
                  </p>
                </div>
                <div className="flex flex-col mx-7 items-center w-200">
                  <FollowButton
                    userId={user.id}
                    followingId={userInfo.id}
                    classFollow="bg-red-500 font-bold py-2 px-8 rounded-lg w-full text-white text-md"
                    classFollowing="bg-gray-700 hover:bg-gray-600 font-bold py-2 px-8 rounded-lg w-full text-white text-md"
                    contentFollow="Follow"
                    contentFollowing="Unfollow"
                  />
                  <p className="mt-5 text-gray-500 dark:text-gray-300 font-bold cursor-pointer">
                    Follower
                  </p>
                </div>
                <div className="flex flex-col mx-7 items-center w-200">
                  <div className="flex items-center font-bold py-2 px-4 rounded-lg hover:bg-gray-400 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors w-full cursor-pointer">
                    <i className="fa-brands fa-facebook-messenger mr-3"></i>
                    <span>Message</span>
                  </div>
                  <p className="mt-5 text-gray-500 dark:text-gray-300 font-bold cursor-pointer">
                    Following
                  </p>
                </div>
                <div className="ml-10">
                  <NavButton
                    onClick={() => setOpenList(true)}
                    className="text-gray-500 hover:text-black text-xxl"
                    content="•••"
                  />
                  {openList && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
                      <div
                        key={userInfo.id}
                        className="bg-white dark:bg-black rounded-lg shadow-lg w-72"
                      >
                        <button
                          className="w-full py-2 text-red-500 dark:hover:bg-gray-900 hover:bg-gray-100"
                          onClick={() => handleReportUser(userInfo.id)}
                        >
                          Report
                        </button>

                        <button className="w-full py-2 dark:hover:bg-gray-900 hover:bg-gray-100">
                          Share
                        </button>

                        <button
                          onClick={() => setOpenList(false)}
                          className="w-full py-2 text-gray-400 hover:bg-gray-700"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="ml-20 mt-10 dark:text-gray-400 text-gray-600 font-bold">
                “{userInfo.biography}”
              </p>
            </div>

            <p className="ml-20 mt-10 dark:text-white text-neutral-800 font-semibold">
              “{userInfo.biography}”
            </p>
          </div>
        </div>
        <div className="p-7">
          <div className="flex justify-center border-b-1 border-zinc-200">
            <button
              className={`py-2 px-4 mr-5 font-normal flex items-center ${
                activeTab === "post"
                  ? "text-neutral-900 border-b-1 border-neutral-800 dark:text-white dark:border-white"
                  : "text-neutral-900 dark:text-white"
              }`}
              onClick={() => setActiveTab("post")}
            >
              <NavButton iconClass="fa-solid fa-pen" />
              <span className="ml-2">POST</span>
            </button>

            <button
              className={`py-2 px-4 mr-5 font-normal flex items-center ${
                activeTab === "reel"
                  ? "text-neutral-900 border-b-1 border-neutral-800 dark:text-white dark:border-white"
                  : "text-neutral-900 dark:text-white"
              }`}
              onClick={() => setActiveTab("reel")}
            >
              <NavButton iconClass="fa-solid fa-film" />
              <span className="ml-2">REEL</span>
            </button>
          </div>

          <div className="mt-4">
            <ProfileTabs
              activeTab={activeTab}
              username={params.username}
              userReels={userReels}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
