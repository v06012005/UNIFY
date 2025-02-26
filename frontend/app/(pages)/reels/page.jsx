"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import avatar2 from "@/public/images/testAvt.jpg";
import { motion, AnimatePresence } from "framer-motion";
//////////reels
import PostReels from "@/components/global/PostReels";
import { fetchPosts } from "@/app/lib/dal";
import { Spinner } from "@heroui/react";
////////////comment
import Cookies from "js-cookie";
import { useApp } from "@/components/provider/AppProvider";
import { fetchComments } from "app/api/service/commentService";
import CommentItem from "@/components/comments/CommentItem";
import CommentInput from "@/components/comments/CommentInput";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

/////////Slider


const Reels = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const postId = "0de81a82-caa6-439c-a0bc-124a83b5ceaf";
  /////////////comment
  const [comments, setComments] = useState([]);
  const { user } = useApp();
  const token = Cookies.get("token");
  useEffect(() => {
    if (!token) return;

    const loadComments = async () => {
      try {
        const data = await fetchComments(postId, token);
        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };


    loadComments();
  }, [token]);

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);
  /////////
  const fetchComments = async () => {
    if (!postId) {
      console.error("postId is undefined");
      return;
    }

    if (!token) {
      console.error("Token không tồn tại");
      return;
    }

    try {
      console.log("Token in fetchComments:", token);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/reels/${postId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Status Code:", response.status);

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log("Data from server:", data);
          setComments(data);
        } else {
          console.error("Response is not JSON");
        }
      } else {
        const errorText = await response.text();
        console.error("Server response:", errorText);

        if (response.status === 401) {
          console.error("LỖI khác (TOKEN đã hợp lệ)");
        }
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      alert("Failed to fetch comments. Please try again later.");
    }
  };
  //////////
  useEffect(() => {
    fetchComments();
  }, [postId]);

  ////////////////
  const handleCommentSubmit = async () => {
    if (!user || !user.id) {
      console.error("User is not logged in");
      return;
    }

    try {
      console.log("Token in handleCommentSubmit:", token);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            postId: postId,
            content: comment,
            parentId: null,
          }),
        }
      );

      console.log("Status Code:", response.status);
      console.log("Response Headers:", response.headers);

      const responseBody = await response.text();
      console.log("Response Body:", responseBody);

      if (response.status === 200 || response.status === 201) {
        const newComment = JSON.parse(responseBody);
        setComments((prevComments) => [...prevComments, newComment]);
        setComment("");
      } else {
        console.error("Server response:", responseBody);
        if (response.status === 401) {
          console.error("LỖI khác (TOKEN đã hợp lệ)");
        }
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please try again later.");
    }
  };
  /////////////////

  /////////
  // const fetchComments = async () => {
  //   if (!postId) {
  //     console.error("postId is undefined");
  //     return;
  //   }

  //   if (!token) {
  //     console.error("Token không tồn tại");
  //     return;
  //   }

  //   try {
  //     console.log("Token in fetchComments:", token);
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/comments/${postId}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.ok) {
  //       const contentType = response.headers.get("content-type");
  //       if (contentType && contentType.includes("application/json")) {
  //         const data = await response.json();
  //         setComments(data);
  //       } else {
  //         console.error("Response is not JSON");
  //       }
  //     } else {
  //       const errorText = await response.text();
  //       console.error("Server response:", errorText);


  /////reels
  // const [videos, setVideos] = useState([]);
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   async function fetchVideos() {
  //     const data = await fetchPosts();
  //     const videoPosts = data.filter((post) => post.mediaType === "VIDEO");
  //     setVideos(videoPosts);
  //     setLoading(false);
  //   }

  //   fetchVideos();
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <Spinner color="primary" label="Loading..." labelColor="primary" />
  //     </div>
  //   );
  // }
  ////


  //   try {
  //     console.log("Token in handleCommentSubmit:", token);
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/comments`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           userId: user.id,
  //           postId: postId,
  //           content: comment,
  //           parentId: null,
  //         }),
  //       }
  //     );

  //     console.log("Status Code:", response.status);
  //     console.log("Response Headers:", response.headers);

  //     const responseBody = await response.text();
  //     console.log("Response Body:", responseBody);

  //     if (response.status === 200 || response.status === 201) {
  //       const newComment = JSON.parse(responseBody);
  //       setComments((prevComments) => [newComment, ...prevComments]);
  //       setComment("");
  //     } else {
  //       console.error("Server response:", responseBody);
  //       if (response.status === 401) {
  //         console.error("LỖI khác (TOKEN đã hợp lệ)");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error submitting comment:", error);
  //     alert("Failed to submit comment. Please try again later.");
  //   }
  // };
  /////////////////
  //TEST//
  useEffect(() => {
    const loadComments = async () => {
      const data = await fetchComments(postId, token);
      setComments(data);
    };
    loadComments();
  }, [postId, token]);

  // const handleCommentSubmit = async () => {
  //   if (!comment.trim()) return;

  //   const newComment = await postComment(user.id, postId, comment, token);
  //   if (newComment) {
  //     setComments((prevComments) => [newComment, ...prevComments]);
  //     setComment("");
  //   }
  // };
  /////

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };


  const toggleComment = () => {
    setIsCommentOpen((prev) => !prev);
  };

  const closeComment = (e) => {
    if (e.target.id === "overlay") {
      setIsCommentOpen(false);
    }
  };
  const handleLike = () => {
    setIsLiked((prev) => !prev);
  };

  const handleSave = () => {
    setIsSaved((prev) => !prev);
  };
  const folloWing = () => {
    setIsFollow((prev) => !prev);
  };

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  const closeMore = (a) => {
    if (a.target.id === "overmore") {
      setIsPopupOpen(false);
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleOpen = () => {
    onOpen();
  };

  const handleAvatarClick = (index) => {
    setSelectedAvatar(index === selectedAvatar ? null : index);
  };

  return (
    <>

      {/* {posts.map((post) => ( */}
      <div
        // key={post.id}
        className={`relative w-[450px] h-[700px] bg-gray-800 mx-auto rounded-2xl overflow-hidden m-5 transition-all duration-500 ${
          isCommentOpen ? "translate-x-[-150px]" : ""
        }`}
      >
        <PostReels></PostReels>

        <div className="absolute bottom-4 left-4 flex items-center space-x- text-white">
          <Image
            src={avatar2}
            alt="User Avatar"
            className="w-10 h-10 bg-gray-600 rounded-full"
          ></Image>
          <div className="flex items-center space-x-2">
            <span className="font-medium pl-2">TanVinh</span>
            <button
              className="backdrop-blur-3xl text-sm p-4 py-1 rounded-2xl font-bold 
             transition-all duration-200 ease-in-out 
             active:scale-125
             hover:bg-gray-700 dark:hover:bg-gray-700"
              onClick={folloWing}
            >
              {isFollow ? "Following" : "Follow"}
            </button>
          </div>
        </div>


        <div className="absolute top-2/3 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-7 text-white text-2xl">
          <div className="flex flex-col items-center">
            <i
              className={`fa-${
                isLiked ? "solid" : "regular"
              } fa-heart hover:opacity-50 focus:opacity-50 transition cursor-pointer ${
                isLiked ? "text-red-500" : "text-white"
              }`}
              onClick={handleLike}
            ></i>
            <span className="text-sm">47k</span>
          </div>

          <div className="flex flex-col items-center">
            <i
              className="fa-regular fa-comment hover:opacity-50 focus:opacity-50 transition cursor-pointer"
              onClick={toggleComment}
            ></i>
            <span className="text-sm">47k</span>
          </div>
          <div className="flex flex-col items-center">
            <i
              onClick={handleOpen}
              className="fa-regular fa-paper-plane hover:opacity-50 focus:opacity-50 transition"
            ></i>
          </div>
          <Modal
            isDismissable={false}
            scrollBehavior={"inside"}
            size="2xl"
            isKeyboardDismissDisabled={true}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-cols">
                    <h1 className="font-bold text-2xl">Share</h1>
                  </ModalHeader>
                  <hr className="bg-gray-200"></hr>
                  <ModalBody>
                    <div className="mt-4">
                      <Input
                        placeholder={"Search..."}
                        className={`w-full h-11 dark:border-white font-bold`}
                      />
                    </div>
                    <div className="flex p-3 justify-around">
                      {[1, 2, 3, 4].map((_, index) => (
                        <div className="text-center" key={index}>
                          <Image
                            src={avatar2}
                            alt={`avtshare-${index}`}
                            className={`rounded-full w-20 h-20 cursor-pointer ${
                              selectedAvatar === index
                                ? "ring-4 dark:ring-white"
                                : ""
                            }`}
                            onClick={() => handleAvatarClick(index)}
                          />
                          <p className="mt-2 font-bold text-lg truncate w-20">
                            Tan Vinh
                          </p>
                          {selectedAvatar === index && (
                            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                              Send
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </ModalBody>
                  <ModalFooter></ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <div className="flex flex-col items-center">
            <i
              className={`fa-${
                isSaved ? "solid" : "regular"
              } fa-bookmark hover:opacity-50 focus:opacity-50 transition cursor-pointer`}
              onClick={handleSave}
            ></i>
          </div>

          <div className="flex flex-col items-center">
            <i
              className="fa-solid fa-ellipsis hover:opacity-50 focus:opacity-50 transition cursor-pointer"
              onClick={togglePopup}
            ></i>
            {isPopupOpen && (
              <div
                id="overmore"
                className="w-44 absolute top-56 right-10 transform -translate-y-1/2 backdrop-blur-xl p-4 rounded-lg shadow-lg text-white"
                onClick={closeMore}
              >
                <ul className=" text-sm">
                  <li className="cursor-pointer  hover:bg-zinc-800  font-bold  text-left p-2 rounded-sm">
                    Copy link
                  </li>
                  <li className="cursor-pointer  hover:bg-zinc-800   font-bold  text-left p-2 rounded-sm">
                    About this account
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ))} */}
      {isCommentOpen && (
        <div
          id="overlay"
          className="fixed top-0 left-0 w-full h-full bg-opacity-50 z-20  "
          onClick={closeComment}
        >
          <div
            className="fixed top-0 right-0 h-full transition-all duration-300"
            style={{
              transform: isCommentOpen ? "translateX(0)" : "translateX(100%)",
            }}
          >
            <div className=" h-full flex flex-col p-4 border   border-l ">
              <div className="flex items-center justify-between dark:text-white mb-4">
                <h2 className="text-2xl text-center font-bold mb-2">
                  Comments
                </h2>
              </div>
              <div className="flex-grow overflow-auto  ">
                {comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
              <CommentInput postId={postId} setComments={setComments} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reels;
