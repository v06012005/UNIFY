import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Smile, Send } from "lucide-react";
import Picker from "emoji-picker-react";
import avatar2 from "@/public/images/testAvt.jpg";
import { postComment, fetchComments } from "app/api/service/commentService";
import Cookies from "js-cookie";
import { useApp } from "@/components/provider/AppProvider";
const CommentInput = ({ postId, setComments }) => {
  const [comment, setComment] = useState("");

  const [isCommentEmpty, setIsCommentEmpty] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const { user } = useApp();
  const token = Cookies.get("token");
  /////////////////
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    const newComment = await postComment(user.id, postId, comment, token);
    if (newComment) {
      setComments((prevComments) => [
        {
          ...newComment,
          username: user.username,
        },
        ...prevComments,
      ]);
      setComment("");
    }
  };
  /////////////
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  return (
    <div className="flex items-center mt-3 text-white p-3 rounded-2xl w-full justify-center relative">
      <Image
        src={avatar2}
        alt="Avatar"
        className="rounded-full w-10 h-10 mr-2"
      />

      <textarea
        placeholder="Add a comment..."
        maxLength={150}
        rows={1}
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          setIsCommentEmpty(e.target.value.trim() === "");
        }}
        onInput={(e) => {
          e.target.style.height = "auto";
          const maxHeight =
            3 * parseFloat(getComputedStyle(e.target).lineHeight); // Giới hạn 3 dòng
          if (e.target.scrollHeight > maxHeight) {
            e.target.style.height = `${maxHeight}px`;
            e.target.style.overflowY = "auto"; // Hiện scroll khi quá dài
          } else {
            e.target.style.height = `${e.target.scrollHeight}px`;
            e.target.style.overflowY = "hidden";
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleCommentSubmit();
          }
        }}
        className="bg-gray-700 text-white placeholder-gray-400 flex-grow py-2 px-4 rounded-2xl focus:outline-none resize-none"
      />

      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="ml-2 text-gray-600 hover:text-gray-400"
      >
        <Smile size={28} />
      </button>

      {showPicker && (
        <div ref={pickerRef} className="absolute bottom-20 right-12 z-50">
          <Picker
            onEmojiClick={(emojiObject) => {
              const newComment = comment + emojiObject.emoji;
              setComment(newComment);
              setIsCommentEmpty(newComment.trim() === "");
            }}
          />
        </div>
      )}

      {!isCommentEmpty && (
        <button
          type="submit"
          onClick={handleCommentSubmit}
          className="ml-2 text-gray-600 hover:text-gray-400"
        >
          <Send size={28} />
        </button>
      )}
    </div>
  );
};

export default CommentInput;
