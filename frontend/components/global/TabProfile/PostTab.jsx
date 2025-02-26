import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSuggestedUsers } from "@/components/provider/SuggestedUsersProvider";

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

const UserPosts = () => {
  const { postUsers, getPostUsers, loading } = useSuggestedUsers();
  const [selectedPost, setSelectedPost] = useState(null);
  const [openList, setOpenList] = useState(false);

  // Gọi API khi component mount
  useEffect(() => {
    getPostUsers();
  }, []);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  return (
    <div>
   {loading ? (
  <p>Đang tải...</p>
) : postUsers.length > 0 ? (
  <div className="grid grid-cols-4 gap-3">
    {postUsers.map((post) => (
      <img
        key={post.id}
        src={post.imageUrl}
        className="w-72 h-80 object-cover cursor-pointer"
        onClick={() => handlePostClick(post)}
      />
    ))}
  </div>
) : (
  <p className="text-center text-gray-500 mt-4">Không có bài đăng nào.</p>
)}


      {selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg flex flex-row w-[1300px] h-[740px]">
            <div className="w-1/2">
              <img
                src={selectedPost.imageUrl}
                className="w-full h-full object-cover rounded-tl-lg rounded-bl-lg"
              />
            </div>

            <div className="w-1/2 flex flex-col">
              <div className="flex items-center justify-between p-3 border-b">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-300">
                    <img
                      src={selectedPost.userAvatar}
                      alt="User Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="font-bold ml-3">{selectedPost.username}</span>
                </div>

                <NavButton
                  onClick={() => setOpenList(true)}
                  className="text-gray-500 hover:text-black"
                  content="•••"
                />
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <p className="text-sm leading-tight">
                  <span className="font-bold mr-4">{selectedPost.username}</span>
                  {selectedPost.caption}
                </p>
              </div>

              <div className="p-4 border-t">
                <div className="flex items-center border-none pt-2">
                  <input
                    type="text"
                    placeholder="Thêm bình luận..."
                    className="flex-1 border-none focus:ring-0 focus:outline-none dark:bg-gray-900 caret-blue-500"
                  />
                  <button className="text-blue-500 font-bold ml-2">Đăng</button>
                </div>
              </div>
            </div>
          </div>
          <button
            className="absolute top-4 right-4 text-white text-2xl font-bold"
            onClick={closeModal}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
