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
    setShowArrows(suggestedUsers.length > 5); // Giảm xuống 5 để giống Instagram
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
      const scrollAmount = 150; // Giảm scroll amount để mượt hơn
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative mt-4 mx-2 p-4 bg-white dark:bg-black rounded-lg shadow-sm ">
      {showArrows && (
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-100 dark:bg-neutral-700 p-1.5 rounded-full shadow-sm opacity-90 hover:opacity-100 transition-opacity z-10"
          onClick={() => scroll("left")}
        >
          <ChevronLeft size={16} className="text-zinc-700 dark:text-gray-300" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-4 py-2 max-w-[calc(100vw-16px)]" // Giới hạn chiều rộng
      >
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : suggestedUsers.length > 0 ? (
          suggestedUsers.slice(0, 10).map((user, index) => (
            <div
              key={user.username}
              onClick={() => handleClick(user.username)}
              className="flex flex-col items-center cursor-pointer group min-w-[80px]" // min-w để cố định kích thước
            >
              <div className="relative w-[70px] h-[70px] overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700 group-hover:border-pink-500 transition-colors">
                {user?.avatar?.url ? (
                  <Image
                    src={user.avatar.url}
                    alt="Avatar"
                    width={70}
                    height={70}
                    priority={index < 3} // Chỉ ưu tiên load 3 ảnh đầu
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src="/images/unify_icon_2.svg"
                    alt="Default Avatar"
                    width={70}
                    height={70}
                    priority={index < 3}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-1 truncate max-w-[70px]">
                {user.username}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No suggestions available.</p>
        )}
      </div>

      {showArrows && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 dark:bg-neutral-800 p-1.5 rounded-full shadow-sm opacity-90 hover:opacity-100 transition-opacity z-10"
          onClick={() => scroll("right")}
        >
          <ChevronRight
            size={16}
            className="text-zinc-700 dark:text-gray-300"
          />
        </button>
      )}
    </div>
  );
};

export default People;
