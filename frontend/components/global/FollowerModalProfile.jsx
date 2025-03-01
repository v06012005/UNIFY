import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSuggestedUsers } from "@/components/provider/SuggestedUsersProvider";
import { useApp } from "@/components/provider/AppProvider";
import FollowButton from "../ui/follow-button";
const FollowerModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { followerUsers, getFollowerUsers, loading } = useSuggestedUsers();
  const router = useRouter();
  const { user } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getFollowerUsers();
  }, []);

  const handleClick = (username) => {
    if (!username) {
      console.error("Lỗi: Username bị null hoặc undefined!");
      return;
    }
    router.push(`/othersProfile/${username}`);
  };

  const filteredUsers = followerUsers?.filter((userData) =>
    userData.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[450px] h-[500px] p-6 ">
        <div className="flex justify-between mb-4 text-2xl">
          <h2 className="text-lg font-bold">Follower</h2>
          <button className="text-gray-500 hover:text-black" onClick={onClose}>
            ×
          </button>
        </div>
        <input
          type="text"
          placeholder="Search ..."
          className="w-full border rounded-full px-4 py-1  dark:bg-black dark:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="h-[390px]  overflow-y-auto scrollbar-hide">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : !filteredUsers || filteredUsers.length === 0 ? (
            <p className="text-gray-500">No followers.</p>
          ) : (
            filteredUsers.slice(0, 11).map((userData) => (
              <li
                key={userData.username}
                className="flex items-center justify-between py-2 border-b border-gray-500 "
              >
                <div
                  onClick={() => handleClick(userData.username)}
                  className="flex items-center cursor-pointer"
                >
                  <Image
                    src={`/images/avt.jpg`}
                    alt="Avatar"
                    className="rounded-full border-2 border-gray-300"
                    width={50}
                    height={50}
                  />
                  <span className="font-medium ml-3">{userData.username}</span>
                </div>
                <FollowButton
                  userId={user.id}
                  followingId={userData.id}
                  classFollow="bg-red-500 font-bold py-1 px-4 rounded-lg text-white text-md"
                  classFollowing="bg-gray-700 hover:bg-gray-600 font-bold py-1 px-4 rounded-lg text-white text-md"
                />
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default FollowerModal;
