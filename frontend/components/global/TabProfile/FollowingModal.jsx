import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFollowingUsers } from "@/app/lib/api/user";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FollowButton from "@/components/ui/follow-button";
import { cn } from "@/app/lib/utils";

const UserSkeleton = () => (
  <div className="animate-pulse flex items-center justify-between p-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-700" />
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded" />
        <div className="h-3 w-16 bg-gray-200 dark:bg-neutral-700 rounded" />
      </div>
    </div>
    <div className="h-8 w-20 bg-gray-200 dark:bg-neutral-700 rounded" />
  </div>
);

const FollowingModal = ({ isOpen, onClose, userId, currentUserId }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: following, isLoading } = useQuery({
    queryKey: ["following", userId],
    queryFn: () => getFollowingUsers(userId),
    enabled: isOpen,
  });

  const filteredFollowing = following?.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl w-[400px] max-h-[600px] flex flex-col">
        <div className="p-4 border-b dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Following
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-2xl font-bold rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search following..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {isLoading ? (
            <div className="divide-y dark:divide-neutral-800">
              {[...Array(5)].map((_, index) => (
                <UserSkeleton key={index} />
              ))}
            </div>
          ) : filteredFollowing?.length > 0 ? (
            <div className="divide-y dark:divide-neutral-800">
              {filteredFollowing.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                      router.push(`/profile/${user.username}`);
                      onClose();
                    }}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={user.avatar?.url || "/images/unify_icon_2.svg"}
                        alt={user.username}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.name}
                      </p>
                    </div>
                  </div>
                  {user.id !== currentUserId && (
                    <FollowButton
                      userId={currentUserId}
                      followingId={user.id}
                      classFollow="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm font-medium"
                      classFollowing="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm font-medium"
                      contentFollow="Follow"
                      contentFollowing="Following"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium mb-2">No following found</p>
              <p className="text-sm">
                {searchQuery
                  ? "Try a different search term"
                  : "When you follow people, they'll appear here"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowingModal; 