"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useApp } from "@/components/provider/AppProvider";
import { useBookmarks } from "@/components/provider/BookmarkProvider";
import Cookies from "js-cookie";
import SavedPostDetailModal from "./SavedPostDetailModal";
import { Spinner } from "@heroui/react";
import { addToast, ToastProvider } from "@heroui/toast";
import { useModal } from "@/components/provider/ModalProvider";
const SavedItems = ({ username }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const { getUserInfoByUsername } = useApp();
  const { bookmarks = [], loading, fetchBookmarks } = useBookmarks();
  const token = Cookies.get("token");

  useEffect(() => {
    if (username && username.trim() !== "") {
      fetchBookmarks();
    }
  }, [username, fetchBookmarks]);

  const handlePostClick = useCallback((post) => {
    setSelectedPost(post);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedPost(null);
  }, []);

  const memoizedBookmarks = useMemo(() => (Array.isArray(bookmarks) ? bookmarks : []), [bookmarks]);

  return (
    <>
     <ToastProvider placement={"top-right"} />
    <div className="max-w-3xl mx-auto">
         {loading ? (
           <div className="flex justify-center items-center h-screen">
             <Spinner
               color="primary"
               label="Loading posts..."
               labelColor="primary"
             />
           </div>
         ) : memoizedBookmarks.length > 0 ? (
           <div className="grid grid-cols-3 gap-1">
             {memoizedBookmarks.map((post) => (
               <div
                 key={post.post.id}
                 className="aspect-square relative group cursor-pointer"
                 onClick={() => handlePostClick(post.post)}
               >
                 {post.post.media.length === 0 ? (
                   <div className="w-full h-full bg-black flex items-center justify-center">
                     <p className="text-white text-sm">View article</p>
                   </div>
                 ) : (
                   <div className="w-full h-full overflow-hidden">
                     {post.post.media[0]?.mediaType === "VIDEO" ? (
                       <video
                         src={post.post.media[0]?.url}
                         className="w-full h-full object-cover"
                         muted
                       />
                     ) : (
                       <img
                         src={post.post.media[0]?.url}
                         className="w-full h-full object-cover"
                         alt="Post media"
                       />
                     )}
                   </div>
                 )}
                 {post.post.media.length > 1 && (
                   <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                     <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                       {post.post.media.map((mediaItem, index) => (
                         <div key={index} className="w-12 h-12 flex-shrink-0">
                           {mediaItem?.mediaType === "VIDEO" ? (
                             <video
                               src={mediaItem?.url}
                               className="w-full h-full object-cover"
                             />
                           ) : (
                             <img
                               src={mediaItem?.url}
                               className="w-full h-full object-cover"
                               alt="Media preview"
                             />
                           )}
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
                 {post.post.media.length > 1 && (
                   <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-1 py-0.5 rounded pointer-events-none">
                     <span>
                       <i className="fa-solid fa-layer-group"></i>
                     </span>
                   </div>
                 )}
                 {post.post.media[0]?.mediaType === "VIDEO" && (
                   <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-1 py-0.5 rounded pointer-events-none">
   
                     {post.post.media.length > 1 ? (
                       <i className="fa-solid fa-layer-group"></i>
                     ) : (
                       <i className="fa-solid fa-film"></i>
                     )}
   
                   </div>
                 )}
               </div>
             ))}
           </div>
         ) : (
        <div className="text-center text-gray-500 mt-4">
          <p>No saved posts available.</p>
          <button onClick={fetchBookmarks} className="text-blue-500">
            Try again
          </button>
        </div>
      )}

      {selectedPost && <SavedPostDetailModal post={selectedPost} onClose={closeModal} />}
    </div>
    </>
  );
};

export default React.memo(SavedItems);
