import React, { useState } from "react";
import Link from "next/link";
const testPost = {
  id: 1,
};

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
  const [selectedPost, setSelectedPost] = useState(null);
  const [openList, setOpenList] = useState(false);
  const handlePostClick = () => {
    setSelectedPost(testPost);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        <img
          src={`/images/avt.jpg`}
          className="w-72 h-80 object-cover cursor-pointer"
          onClick={handlePostClick}
        />
      </div>

      {selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg flex flex-row w-[1200px]">
            <div className="w-1/2">
              <img
                src={`/images/avt.jpg`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-1/2 flex flex-col">
              <div className="flex items-center justify-between p-3 border-b">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-300">
                    <img
                      src={`/images/avt.jpg`}
                      alt="User Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="font-bold ml-3">huynhdiz</span>
                </div>

                <NavButton
                  onClick={() => setOpenList(true)}
                  className="text-gray-500 hover:text-black"
                  content="•••"
                ></NavButton>
                {openList && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-black rounded-lg shadow-lg w-72">
                      <button className="w-full py-2 text-red-500 dark:hover:bg-gray-900 hover:bg-gray-100">
                        Delete
                      </button>
                      <button className="w-full py-2 dark:hover:bg-gray-900 hover:bg-gray-100">
                        Update
                      </button>
                      <button className="w-full py-2 dark:hover:bg-gray-900 hover:bg-gray-100">
                        Share
                      </button>
                      <button className="w-full py-2 dark:hover:bg-gray-900 hover:bg-gray-100">
                        Disable Comments
                      </button>
                      <button className="w-full py-2 dark:hover:bg-gray-900 hover:bg-gray-100">
                        Go to Post
                      </button>

                      <button
                        onClick={() => setOpenList(false)}
                        className="w-full py-2 text-gray-400 hover:bg-gray-700"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex items-start space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full border-2 border-gray-300">
                    <img
                      src={`/images/avt.jpg`}
                      alt="User Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm leading-tight">
                      <span className="font-bold mr-4">huynhdiz</span> Nghe nhạc
                      nà mn
                    </p>
                    <div className="flex">
                      <span className="text-xs text-gray-500 mr-5">
                        2 giờ trước
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full border-2 border-gray-300">
                    <img
                      src={`/images/avt.jpg`}
                      alt="User Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm leading-tight">
                      <span className="font-bold mr-4">user2</span> Đẹp quá!
                    </p>
                    <div className="flex">
                      <span className="text-xs text-gray-500 mr-5">
                        2 giờ trước
                      </span>
                      <span className="text-xs text-gray-500">Reply</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex space-x-4">
                    <NavButton iconClass="fa-regular fa-heart" />
                    <NavButton iconClass="fa-regular fa-comment" />
                    <NavButton iconClass="fa-regular fa-paper-plane" />
                  </div>
                  <NavButton iconClass="fa-regular fa-bookmark" />
                </div>
                <p className="dark:text-gray-500">Thời gian</p>
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
