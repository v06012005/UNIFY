import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSuggestedUsers } from "@/components/provider/SuggestedUsersProvider";
import { useApp } from "@/components/provider/AppProvider";
import FollowButton from "../ui/follow-button";

const FollowingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { followingUsers, getFollowingUsers, loading } = useSuggestedUsers();
  const router = useRouter();
  const { user } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (
      !hasFetched.current &&
      (!followingUsers || followingUsers.length === 0)
    ) {
      getFollowingUsers();
    }
  }, [followingUsers]);

  const handleClick = (username) => {
    if (!username) {
      console.error("Lỗi: Username bị null hoặc undefined!");
      return;
    }
    router.push(`/othersProfile/${username}`);
  };

  const filteredUsers = followingUsers?.filter((userData) =>
    userData.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-neutral-800 rounded-lg w-[450px] h-[500px] p-6 ">
        <div className="flex justify-between mb-4 text-2xl">
          <h2 className="text-lg font-bold">Following</h2>
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
          className="w-full border rounded-full px-4 py-1 dark:bg-neutral-800 dark:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="h-[390px] overflow-y-auto scrollbar-hide">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : !filteredUsers || filteredUsers.length === 0 ? (
            <p className="text-gray-500">No Followings.</p>
          ) : (
            filteredUsers.slice(0, 11).map((userData) => (
              <li
                key={userData.username}
                className="flex items-center justify-between py-2 border-b border-gray-300 dark:border-neutral-700"
              >
                <div
                  onClick={() => handleClick(userData.username)}
                  className="flex items-center cursor-pointer"
                >
                  <div className="relative w-[50px] h-[50px] overflow-hidden rounded-full border-2 border-gray-300 dark:border-neutral-700">
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
                  <span className="font-medium ml-3">{userData.username}</span>
                </div>
                <FollowButton
                  userId={user.id}
                  followingId={userData.id}
                  classFollow="bg-red-500 font-bold py-1 px-4 rounded-lg text-white text-md"
                  classFollowing="dark:bg-zinc-700 bg-gray-300 dark:hover:bg-zinc-600 hover:bg-gray-400 font-bold py-1 px-4 rounded-lg dark:text-white text-black text-md"
                  contentFollowing="Unfollow"
                  contentFollow="Follow"
                />
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default FollowingModal;
