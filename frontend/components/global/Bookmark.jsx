import { useBookmarks } from "@/components/provider/BookmarkProvider";

export default function BookmarkButton({ postId, className }) {
  const { savedPostsMap, toggleBookmark } = useBookmarks();

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <i
        className={`fa-${
          savedPostsMap[postId] ? "solid" : "regular"
        } fa-bookmark ${
          savedPostsMap[postId] ? "text-yellow-400" : " text-black dark:text-white"
        } hover:opacity-50 focus:opacity-50 transition cursor-pointer`}
        onClick={() => toggleBookmark(postId)}
      />
    </div>
  );
}