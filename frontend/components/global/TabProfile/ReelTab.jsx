
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/components/provider/AppProvider";
import axios from "axios";
import Cookies from "js-cookie";

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

const UserReels = ({ username }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [openList, setOpenList] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const { user, getUserInfoByUsername } = useApp();
  const router = useRouter();
  const [postUsers, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

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
              })
              .catch((error) => console.log(error));
          }
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeletePost = async (postId) => {
    try {
        const token = Cookies.get("token");
        if (!token) return;

        await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        setPosts(posts.filter(post => post.id !== postId));
        setShowModal(false);
    } catch (error) {
        console.error("Error deleting post:", error);
    }
};

const openDeleteModal = (postId) => {
    setPostToDelete(postId);
    setShowModal(true);
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
    {postUsers
      .filter(post => post.media.some(mediaItem => mediaItem.mediaType === "VIDEO")) 
      .map((post) => {
        const firstVideo = post.media.find(mediaItem => mediaItem.mediaType === "VIDEO"); 
        return (
          <div key={post.id} className="w-72 relative group">
            <div className="w-72 h-80 overflow-hidden">
              <video
                src={firstVideo.url}
                className="w-full h-full object-cover cursor-pointer"
                controls
                onClick={() => handlePostClick(post)}
              />
            </div>
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
        );
      })}
  </div>
) : (
  <p className="text-center text-gray-500 mt-4">Không có video nào.</p>
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
                    <div key={selectedPost.id.id} className="bg-white dark:bg-black rounded-lg shadow-lg w-72">
                      <button 
                      onClick={() => openDeleteModal(selectedPost.id)}
                      className="w-full py-2 text-red-500 dark:hover:bg-gray-900 hover:bg-gray-100">
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
                {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to delete this post?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeletePost(postToDelete)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
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
                <div className="flex items-start space-x-2 mb-2 mt-5">
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
                <div className="flex items-center border-none pt-2">

                  <input
                    type="text"
                    placeholder="Add comment..."
                    className="flex-1 border-none focus:ring-0 focus:outline-none dark:bg-gray-900 caret-blue-500"
                  />
                  <button className="text-blue-500 font-bold ml-2">Save</button>

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

export default UserReels;
