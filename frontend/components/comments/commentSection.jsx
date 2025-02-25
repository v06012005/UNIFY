import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Smile, Send } from "lucide-react";
import Picker from "emoji-picker-react";
import Reply from "@/components/comments/Reply";
import Content from "@/components/comments/Content";
import LikeButton from "@/components/global/LikeButton";
import { Button, CardFooter } from "@/components/ui/button";

import { Card, CardFooter, Button } from "@heroui/react";

const CommentSection = ({
  isCommentOpen,
  closeComment,
  comments,
  comment,
  setComment,
  handleCommentSubmit,
  avatar2,
}) => {
  const [isShown, setIsShown] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [isCommentEmpty, setIsCommentEmpty] = useState(true);
  const pickerRef = useRef(null);

  return (
    isCommentOpen && (
      <div
        id="overlay"
        className="fixed top-0 left-0 w-full h-full bg-opacity-50 z-20"
        onClick={closeComment}
      >
        <div
          className="fixed top-0 right-0 h-full transition-all duration-300"
          style={{
            transform: isCommentOpen ? "translateX(0)" : "translateX(100%)",
          }}
        >
          <div className="h-full flex flex-col p-4 border border-l">
            <div className="flex items-center justify-between dark:text-white mb-4">
              <h2 className="text-2xl text-center font-bold mb-2">Comments</h2>
            </div>

            <div className="flex-grow overflow-auto">
              {comments.map((comment) => (
                <Card
                  key={comment.id}
                  className="overflow-visible border-none bg-transparent shadow-none p-5 m-4"
                >
                  <div>
                    <div className="flex items-center">
                      <Image
                        src={avatar2}
                        alt="User avatar"
                        className="rounded-full w-12 h-12"
                      />
                      <h4 className="text-base font-bold truncate w-32 pl-2">
                        {comment.username}
                      </h4>
                      <h4 className="text-xs font-bold truncate w-40 dark:text-gray-500">
                        {comment.commentedAt &&
                        !isNaN(new Date(comment.commentedAt).getTime())
                          ? formatDistanceToNow(new Date(comment.commentedAt), {
                              addSuffix: true,
                            })
                          : "Vừa xong"}
                      </h4>
                    </div>
                    <div>
                      <Content text={comment.content} />
                    </div>
                  </div>

                  <CardFooter className="flex flex-row justify-end">
                    <LikeButton className="!text-sm" />
                    <Button
                      size="sm"
                      className="bg-transparent dark:text-white"
                    >
                      <i className="fa-solid fa-reply"></i>Reply
                    </Button>
                    <Button
                      onPress={() => setIsShown(!isShown)}
                      size="sm"
                      className="bg-transparent dark:text-white"
                    >
                      <i className="fa-solid fa-comments"></i>Show Replies
                    </Button>
                    <Button
                      size="sm"
                      className="bg-transparent dark:text-white"
                      startContent={<i className="fa-solid fa-ellipsis"></i>}
                    >
                      More
                    </Button>
                  </CardFooter>

                  {isShown && comment.replies && comment.replies.length > 0 && (
                    <div className="w-full flex flex-col items-end">
                      {comment.replies.map((reply) => (
                        <Reply key={reply.id} reply={reply} />
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>

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
                <div
                  ref={pickerRef}
                  className="absolute bottom-20 right-12 z-50"
                >
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
          </div>
        </div>
      </div>
    )
  );
};

export default CommentSection;
