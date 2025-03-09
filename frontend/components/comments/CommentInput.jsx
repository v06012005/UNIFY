"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Smile, Send } from "lucide-react";
import Picker from "emoji-picker-react";
import avatar2 from "@/public/images/testAvt.jpg";
import { postComment } from "app/api/service/commentService";
import Cookies from "js-cookie";
import { useApp } from "@/components/provider/AppProvider";

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
      <Image
        src={avatar2}
        alt="Avatar"
        className="rounded-full w-10 h-10 mr-2"
      />
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
        <div className="absolute top-[-30px] text-red-500 text-sm">{error}</div>
      )}
      {error && (
        <div className="absolute top-[-30px] text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
};

export default CommentInput;
