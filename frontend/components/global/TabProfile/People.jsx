import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  SuggestedUsersProvider,
  useSuggestedUsers,
} from "@/components/provider/SuggestedUsersProvider";
import { ChevronLeft, ChevronRight } from "lucide-react";

const People = () => {
  const scrollRef = useRef(null);
  const router = useRouter();
  const [showArrows, setShowArrows] = useState(false);
  const hasFetched = useRef(false);

  const { suggestedUsers, getSuggestedUsers, loading } = useSuggestedUsers();

  useEffect(() => {
    if (!hasFetched.current && suggestedUsers.length === 0) {
      getSuggestedUsers();
      hasFetched.current = true;
    }
  }, []);

  useEffect(() => {
    setShowArrows(suggestedUsers.length > 10);
  }, [suggestedUsers]);

  const handleClick = (username) => {
    if (!username) {
      console.error("Lỗi: Username bị null hoặc undefined!");
      return;
    }
    router.push(`/othersProfile/${username}`);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative mt-2 ml-3 mr-5 p-3">
      {showArrows && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
          onClick={() => scroll("left")}
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-11 justify-center overflow-x-auto scrollbar-hide scroll-smooth px-10"
      >
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : suggestedUsers.length > 0 ? (
          suggestedUsers.slice(0, 11).map((user, index) => (
            <div
              key={user.username}
              onClick={() => handleClick(user.username)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="relative w-[64px] h-[64px] overflow-hidden rounded-full border-2 border-gray-300">
                {user?.avatar?.url ? (
                  <Image
                    src={user.avatar.url}
                    alt="Avatar"
                    width={64}
                    height={64}
                    priority={index === 0}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src="/images/unify_icon_2.svg"
                    alt="Default Avatar"
                    width={64}
                    height={64}
                    priority={index === 0}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <p className="text-sm text-gray-700 dark:text-white mt-1">
                {user.username}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">There are no tips.</p>
        )}
      </div>

      {showArrows && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
          onClick={() => scroll("right")}
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
};

export default People;
