import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/components/provider/AppProvider";
import axios from "axios";
import Cookies from "js-cookie";
////////////comment
import { fetchComments } from "app/api/service/commentService";
import CommentItem from "@/components/comments/CommentItem";
import CommentInput from "@/components/comments/CommentInput";

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

const UserPosts = ({ username    }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [openList, setOpenList] = useState(false);

  const [selectedMedia, setSelectedMedia] = useState(null);
  const { user, getUserInfoByUsername } = useApp();
  const router = useRouter();
  const [postUsers, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  /////////////comment
  const [comments, setComments] = useState([]);
  const token = Cookies.get("token");
  // const postId = "0de81a82-caa6-439c-a0bc-124a83b5ceaf";

  useEffect(() => {
    if (selectedPost?.id) {
      const loadComments = async () => {
        const data = await fetchComments(selectedPost.id, token);
        setComments(data);
      };
      loadComments();
    }
  }, [selectedPost, token]);
  /////////
  const getPostUsers = async (username) => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      getUserInfoByUsername(username)
        .then((data) => {
          if (data) {
            const response = axios
              .get(
                `${process.env.NEXT_PUBLIC_API_URL}/posts/my?userId=${data.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              )
              .then((response) => {
                setPosts(response.data || []);
                setLoading(false);
                console.log("Danh sách bài đăng của tôi:", response.data);
              })
              .catch((error) => console.log(error));
          }
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (username) {
      getPostUsers(username);
    }
  }, [username]);

  useEffect(() => {
    if (selectedPost?.media?.length > 0) {
      setSelectedMedia(selectedPost.media[0]);
    } else {
      setSelectedMedia(null);
    }
  }, [selectedPost]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setSelectedMedia(post.media.length > 0 ? post.media[0] : null);
    console.log("Post ID:", post.id);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setSelectedMedia(null);
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : postUsers.length > 0 ? (
        <div className="grid grid-cols-4 gap-3">
          {postUsers.map((post) => (
            <div key={post.id} className="w-72 relative group">
              {post.media.length === 0 ? (
                <div
                  className="w-72 h-80 bg-black flex items-center justify-center cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <p className="text-white">View article</p>
                </div>
              ) : (
                <div className="w-72 h-80 overflow-hidden">
                  {post.media[0].mediaType === "VIDEO" ? (
                    <video
                      src={post.media[0].url}
                      className="w-full h-full object-cover cursor-pointer"
                      controls
                      onClick={() => handlePostClick(post)}
                    />
                  ) : (
                    <img
                      src={post.media[0].url}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handlePostClick(post)}
                    />
                  )}
                </div>
              )}
              {post.media.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {post.media.map((mediaItem, index) => (
                      <div key={index} className="w-16 h-16">
                        {mediaItem.mediaType === "VIDEO" ? (
                          <video
                            src={mediaItem.url}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => handlePostClick(post)}
                          />
                        ) : (
                          <img
                            src={mediaItem.url}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => handlePostClick(post)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">Không có bài đăng nào.</p>
      )}
      {selectedPost && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          data-post-id={selectedPost.id}
        >
          <div className="bg-white dark:bg-gray-900 rounded-lg flex flex-row w-[1300px] h-[740px]">
            <div className="w-1/2 relative">
              {selectedMedia ? (
                selectedMedia.mediaType === "VIDEO" ? (
                  <video
                    src={selectedMedia.url}
                    controls
                    className="w-full h-full object-cover rounded-tl-lg rounded-bl-lg"
                  />
                ) : (
                  <img
                    src={selectedMedia.url}
                    className="w-full h-full object-cover rounded-tl-lg rounded-bl-lg"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black text-white">
                  <p>No images/videos available</p>
                </div>
              )}

              {selectedPost.media.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[90%] bg-black bg-opacity-50 p-2 rounded-lg overflow-x-auto flex gap-2">
                  {selectedPost.media.map((item, index) => (
                    <div
                      key={index}
                      className={`w-16 h-16 cursor-pointer border-2 ${
                        selectedMedia.url === item.url
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedMedia(item)}
                    >
                      {item.mediaType === "VIDEO" ? (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <img
                          src={item.url}
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-1/2 flex flex-col">
              <div className="flex items-center justify-between p-3 border-b">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-300">
                    <img
                      src={selectedPost.user?.avatar || "/default-avatar.png"}
                      alt="User Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="font-bold ml-3">
                    {selectedPost.user?.username}
                  </span>
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
                <p className="text-sm leading-tight">
                  <span className="font-bold mr-4">
                    {selectedPost.user?.username}
                  </span>
                  {selectedPost.captions}
                </p>
                <div className=" items-start space-x-2 mb-2 mt-5">
                  {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </div>
              </div>

              <div className="p-4 border-t">
                <div className="flex items-center border-none pt-2">
                  <CommentInput
                    postId={selectedPost.id}
                    setComments={setComments}
                  />
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
