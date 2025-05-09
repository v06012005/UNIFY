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
import { useFollow } from "@/components/provider/FollowProvider";

import ReportUserModal from "@/components/global/Report/ReportUserModal";

const NavButton = ({ iconClass, href = "", content = "", onClick }) => {
  return (
    <Link
      className="flex items-center justify-center text-neutral-900 dark:text-white hover:text-gray-600 transition-colors"
      href={href}
      onClick={onClick}
    >
      <i className={`${iconClass} text-lg`}></i>
      {content && <span className="ml-2 text-sm font-medium">{content}</span>}
    </Link>
  );
};

const Page = () => {
  const [activeTab, setActiveTab] = useState("post");
  const [userInfo, setUserInfo] = useState(null);
  const [userReels, setUserReels] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openList, setOpenList] = useState(false);

  const params = useParams();

  const { createUserReport } = useReports();
  const { user, getUserInfoByUsername } = useApp();
  const { countFollowers, countFollowing } = useFollow();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openReportModal = () => {
    setIsModalOpen(true);
    setOpenList(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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

  useEffect(() => {
    const fetchCounts = async () => {
      if (userInfo) {
        const followers = await countFollowers(userInfo.id);
        const following = await countFollowing(userInfo.id);
        setFollowerCount(followers);
        setFollowingCount(following);
      }
    };
    fetchCounts();
  }, [userInfo, countFollowers, countFollowing]);

  const handleReportUser = useCallback(
    async (data, reason) => {
      const report = await createUserReport(data, reason);

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
        } else {
          addToast({
            title: "Encountered an error",
            description: "Error: " + errorMessage,
            timeout: 3000,
            shouldShowTimeoutProgess: true,
            color: "danger",
          });
        }

        setIsModalOpen(false);

        return;
      }
      addToast({
        title: "Success",
        description: "Report user successful.",
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "success",
      });
      setIsModalOpen(false);
    },
    [createUserReport]
  );

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <>
      <ToastProvider placement="top-right" />
      <div className="max-w-4xl mx-auto py-6">
        {/* Profile Header */}
        <div className="flex px-4 sm:px-6">
          {/* Avatar */}

          <div className="w-36 h-36 sm:w-48 sm:h-48 flex-shrink-0">
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gray-300">
              {userInfo?.avatar?.url ? (
                <Image
                  src={userInfo.avatar.url}
                  alt="Avatar"
                  width={154}
                  height={154}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Image
                  src="/images/unify_icon_2.svg"
                  alt="Default Avatar"
                  width={154}
                  height={154}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
          </div>

          {/* Profile Info */}

          <div className="ml-12 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-normal text-neutral-800 dark:text-white truncate max-w-[200px]">
                {userInfo.username}
              </h3>
              <NavButton
                onClick={() => setOpenList(true)}
                iconClass="fa-solid fa-ellipsis"
              />
            </div>

            {/* Stats */}
            <div className="flex space-x-6 mt-4">
              <div className="text-center">
                <span className="font-bold text-neutral-800 dark:text-white">
                  {userInfo.posts || 0}
                </span>{" "}
                <span className="text-gray-500 dark:text-gray-300 font-bold">
                  posts
                </span>
              </div>
              <div className="text-center">
                <span className="font-bold text-neutral-800 dark:text-white">
                  {followerCount || 0}
                </span>{" "}
                <span className="text-gray-500 dark:text-gray-300 font-bold">
                  followers
                </span>
              </div>
              <div className="text-center">
                <span className="font-bold text-neutral-800 dark:text-white">
                  {followingCount || 0}
                </span>{" "}
                <span className="text-gray-500 dark:text-gray-300 font-bold">
                  following
                </span>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-4 text-sm dark:text-white text-neutral-800 font-semibold">
              “{userInfo.biography}”
            </p>

            <div className="mt-4 flex space-x-2">
              <FollowButton
                userId={user.id}
                followingId={userInfo.id}
                classFollow="bg-red-500 font-bold py-2 px-8 rounded-lg w-full text-white text-md"
                classFollowing="bg-gray-700 hover:bg-gray-600 font-bold py-2 px-8 rounded-lg w-full text-white text-md"
                contentFollow="Follow"
                contentFollowing="Unfollow"
              />
              <Link
                href={{
                  pathname: `/messages`,
                  query: {
                    userId: userInfo.id,
                    username: userInfo.username,
                    avatar:
                      userInfo.avatar?.url || "/images/default-avatar.svg",
                    fullname: userInfo.firstName + " " + userInfo.lastName,
                  },
                }}
                className="flex items-center font-bold py-2 px-4 rounded-lg hover:bg-zinc-400 bg-gray-200 dark:bg-neutral-700 dark:hover:bg-gray-600 transition-colors w-full justify-center"
              >
                <i className="fa-brands fa-facebook-messenger mr-2"></i>
                <span>Message</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t dark:border-neutral-600 border-gray-300">
          <div className="flex justify-center space-x-12">
            <button
              className={`py-3 text-sm font-medium flex items-center ${
                activeTab === "post"
                  ? "text-neutral-900 dark:text-white border-t-2 border-neutral-800 dark:border-white"
                  : "text-neutral-900 dark:text-white"
              }`}
              onClick={() => setActiveTab("post")}
            >
              <i className="fa-solid fa-table-cells mr-2"></i>
              POST
            </button>
            <button
              className={`py-3 text-sm font-medium flex items-center ${
                activeTab === "reel"
                  ? "text-neutral-900 dark:text-white border-t-2 border-neutral-800 dark:border-white"
                  : "text-neutral-900 dark:text-white"
              }`}
              onClick={() => setActiveTab("reel")}
            >
              <i className="fa-solid fa-film mr-2"></i>
              REEL
            </button>
          </div>
        </div>

        <div className="mt-4">
          <ProfileTabs
            activeTab={activeTab}
            username={params.username}
            userReels={userReels}
          />
        </div>

        {openList && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-white dark:bg-neutral-900 rounded-xl w-72 shadow-2xl border border-gray-200 dark:border-neutral-800">
              <button
                className="w-full py-3.5 text-red-500 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 rounded-t-xl"
                // onClick={() => handleReportUser(userInfo.id)}
                onClick={openReportModal}
              >
                Report
              </button>
              <button className="w-full py-3.5 text-neutral-800 dark:text-gray-100 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-200">
                Share
              </button>
              <button
                onClick={() => setOpenList(false)}
                className="w-full py-3.5 text-gray-500 dark:text-gray-400 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all duration-200 rounded-b-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}
        <ReportUserModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleReportUser}
          userId={userInfo.id}
        />
      </div>
    </>
  );
};

export default Page;
