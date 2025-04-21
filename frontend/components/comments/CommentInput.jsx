"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Smile, Send } from "lucide-react";
import Picker from "emoji-picker-react";
import { postComment } from "@/lib/api/services/commentService";
import Cookies from "js-cookie";
import { useApp } from "@/components/provider/AppProvider";
import defaultAvatar from "public/images/unify_icon_2.svg";

const CommentInput = ({
  postId,
  setComments,
  parentComment,
  onCancelReply,
}) => {
  const [comment, setComment] = useState("");
  const [isCommentEmpty, setIsCommentEmpty] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState(null);
  const pickerRef = useRef(null);
  const { user } = useApp();
  const token = Cookies.get("token");

  useEffect(() => {
    if (parentComment) {
      setComment(`@${parentComment.username} `);
      setIsCommentEmpty(false);
    } else {
      setComment("");
      setIsCommentEmpty(true);
    }
  }, [parentComment]);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    if (!postId || !user?.id || !token) {
      setError("Missing required data to submit comment.");
      return;
    }

    try {
      const newComment = await postComment(
        user.id,
        postId,
        comment,
        token,
        parentComment ? parentComment.id : null
      );
      console.log("Comment posted successfully:", newComment);
      const enrichedComment = {
        ...newComment,
        username: user?.username || "Unknown",
        avatarUrl: user?.avatar?.url || null, // Thêm avatarUrl vào comment mới
      };
      setComments(enrichedComment);
      setComment(parentComment ? `@${parentComment.username} ` : ""); // Giữ @username
      setIsCommentEmpty(!parentComment);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
    setComment(""); // Reset textarea
    setIsCommentEmpty(true);
    if (onCancelReply) onCancelReply(); // Gọi hàm reset replyingTo
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        !event.target.closest("button")
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="flex items-center text-white rounded-2xl w-full justify-center relative">
      {/* Hiển thị avatar của người dùng hiện tại */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 mr-2">
        {user?.avatar?.url ? (
          <Image
            src={user.avatar.url}
            alt={`${user.username || "Unknown"}'s avatar`}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        ) : (
          <Image
            src={defaultAvatar}
            alt="Default Avatar"
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        )}
      </div>

      <textarea
        placeholder={
          parentComment
            ? `Reply to @${parentComment.username}...`
            : "Add a comment..."
        }
        maxLength={150}
        rows={1}
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          setIsCommentEmpty(
            e.target.value.trim() ===
              (parentComment ? `@${parentComment.username} ` : "")
          );
        }}
        onInput={(e) => {
          e.target.style.height = "auto";
          const maxHeight =
            3 * parseFloat(getComputedStyle(e.target).lineHeight);
          if (e.target.scrollHeight > maxHeight) {
            e.target.style.height = `${maxHeight}px`;
            e.target.style.overflowY = "auto";
          } else {
            e.target.style.height = `${e.target.scrollHeight}px`;
            e.target.style.overflowY = "hidden";
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleCommentSubmit();
          }
        }}
        className="text-black border-1 border-neutral-300 dark:border-none dark:bg-neutral-800 dark:text-white dark:placeholder-zinc-200 flex-grow py-2 px-4 rounded-2xl focus:outline-none resize-none"
      />
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="ml-2 dark:text-neutral-400 hover:text-gray-700 text-zinc-500 dark:hover:text-zinc-200"
      >
        <Smile size={28} />
      </button>
      {showPicker && (
        <div ref={pickerRef} className="absolute bottom-20 right-12 z-50">
          <Picker
            onEmojiClick={(emojiObject) => {
              const newComment = comment + emojiObject.emoji;
              setComment(newComment);
              setIsCommentEmpty(
                newComment.trim() ===
                  (parentComment ? `@${parentComment.username} ` : "")
              );
            }}
          />
        </div>
      )}
      {!isCommentEmpty && (
        <>
          <button
            type="submit"
            onClick={handleCommentSubmit}
            className="ml-2 dark:text-neutral-400 hover:text-gray-700 text-zinc-500 dark:hover:text-zinc-200"
          >
            <Send size={28} />
          </button>
          {parentComment && (
            <button
              type="button"
              onClick={handleCancel}
              className="ml-2 dark:text-neutral-400 hover:text-gray-700 text-zinc-500 dark:hover:text-zinc-200"
            >
              Cancel
            </button>
          )}
        </>
      )}
      {error && (
        <div className="absolute top-[-50px]  text-red-600 text-sm px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.25)] backdrop-blur-md shadow-md border border-red-300/40">
          {error}
        </div>
      )}
    </div>
  );
};

export default CommentInput;
