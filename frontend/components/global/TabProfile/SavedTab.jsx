import React, { useState, useEffect } from "react";
import Link from "next/link";
////////////
import Cookies from "js-cookie";
import { useApp } from "@/components/provider/AppProvider";
import { fetchComments } from "app/api/service/commentService";
import CommentItem from "@/components/comments/CommentItem";
import CommentInput from "@/components/comments/CommentInput";
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
const SavedItems = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [openList, setOpenList] = useState(false);

  /////////////
  const [comments, setComments] = useState([]);
  const { user } = useApp();
  const token = Cookies.get("token");
  const postId = "0de81a82-caa6-439c-a0bc-124a83b5ceaf";
  useEffect(() => {
    const loadComments = async () => {
      const data = await fetchComments(postId, token);
      setComments(data);
    };
    loadComments();
  }, [postId, token]);
  //////
  const handlePostClick = () => {
    setSelectedPost(testPost);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  return (
    <div>
      <h3 className="text-sm text-gray-400 mb-2">
        Chỉ mình bạn có thể xem mục mình đã lưu{" "}
      </h3>
      <div className="grid grid-cols-4 gap-3">
        <img
          src={`/images/avt.jpg`}
          className="w-72 h-80 object-cover cursor-pointer"
          onClick={handlePostClick}
        />
      </div>

      {selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg flex flex-row w-[1300px] h-[740px]">
            <div className="w-1/2">
              <img
                src={`/images/avt.jpg`}
                className="w-full h-full object-cover rounded-tl-lg rounded-bl-lg"
              />
            </div>

            <div className="w-1/2 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
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
                        Share
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

              <div className="flex-1 p-4 h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
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
                <div className="flex items-center pt-2 ">
                  <CommentInput postId={postId} setComments={setComments} />
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

export default SavedItems;
