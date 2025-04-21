"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSuggestedUsers } from "@/components/provider/SuggestedUsersProvider";
import { useApp } from "@/components/provider/AppProvider";
const FriendModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { friendUsers, getFriendUsers, loading } = useSuggestedUsers();
  const router = useRouter();

  useEffect(() => {
    getFriendUsers();
  }, []);

  const handleClick = (username) => {
    if (!username) {
      console.error("Lỗi: Username bị null hoặc undefined!");
      return;
    }
    router.push(`/othersProfile/${username}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-neutral-800 rounded-lg w-[450px] h-[500px] p-6 ">
        <div className="flex justify-between mb-4 text-2xl">
          <h2 className="text-lg font-bold">Friend</h2>
          <button
            className="text-zinc-500 dark:hover:text-white hover:text-black"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <input
          type="text"
          placeholder="Search ..."
          className="w-full border rounded-full px-4 py-1  dark:bg-black dark:border-gray-600"
        />
        <ul className="h-[390px]  overflow-y-auto scrollbar-hide">
          {loading ? (
            <p className="text-zinc-500">Loading...</p>
          ) : !friendUsers || friendUsers.length === 0 ? (
            <p className="text-zinc-500 mt-4">
              Make friends to share more interesting things.
            </p>
          ) : (
            friendUsers.slice(0, 11).map((user) => (
              <li
                key={user.username}
                className="flex items-center justify-between py-2 border-b border-gray-300 "
              >
                <div
                  onClick={() => handleClick(user.username)}
                  className="flex items-center cursor-pointer"
                >
                  <div className="relative w-[50px] h-[50px] overflow-hidden rounded-full border-2 border-gray-300">
                    {userData?.avatar?.url ? (
                      <Image
                        src={userData.avatar.url}
                        alt="Avatar"
                        width={50}
                        height={50}
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
                  <span className="font-medium ml-3">{user.username}</span>
                </div>
                <div className="flex items-center space-x-2 border px-6 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 dark:bg-gray-700 cursor-pointer">
                  <span>Xóa</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default FriendModal;
