"use client";

import { Card, CardFooter, Button } from "@heroui/react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import Reply from "@/components/comments/Reply";
import Content from "@/components/comments/Content";
import LikeButton from "@/components/global/LikeButton";
import defaultAvatar from "public/images/unify_icon_2.svg"; // Sử dụng hình ảnh mặc định giống Page

const CommentItem = ({
  comment,
  currentUserId,
  onReplySubmit,
  onReplyClick,
}) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <Card
      key={comment.id}
      className="overflow-visible border-none bg-transparent shadow-none p-3"
    >
      <div>
        <div className="flex items-center">

          {/* Hiển thị avatar */}
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-zinc-300">
            {comment.avatarUrl ? (
              <Image
                src={comment.avatarUrl}
                alt={`${comment.username || "Unknown"}'s avatar`}
                width={44}
                height={44}
                className="object-cover w-full h-full"
              />
            ) : (
              <Image
                src={defaultAvatar}
                alt="Default Avatar"
                width={44}
                height={44}
                className="object-cover w-full h-full"
              />
            )}
          </div>

          <h4 className="text-base font-bold truncate max-w-96 px-3">
            {comment.username || "Unknown"}
          </h4>
          <h4 className="text-xs truncate w-32 dark:text-gray-500">
            {comment.commentedAt &&
            !isNaN(new Date(comment.commentedAt).getTime())
              ? formatDistanceToNow(new Date(comment.commentedAt), {
                  addSuffix: true,
                })
              : "Vừa xong"}
          </h4>
        </div>

        <div className="indent-14 mb-5">
          <Content
            text={comment.content}
            className="leading-snug text-base dark:text-gray-200 w-fit max-w-full"
          />

        </div>
      </div>

      <CardFooter className="flex flex-row justify-end p-0">
        <LikeButton className="!text-sm space-x-1" />
        <Button
          size="sm"
          className="bg-transparent dark:text-white"
          onPress={onReplyClick}
        >
          <i className="fa-solid fa-reply"></i> Reply
        </Button>
        <Button
          onPress={() => setIsShown(!isShown)}
          size="sm"
          className="bg-transparent dark:text-white"
        >
          <i className="fa-solid fa-comments"></i> Show Replies
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
            <Reply
              key={reply.id}
              reply={reply}
              currentUserId={currentUserId}
              onReplySubmit={onReplySubmit}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default CommentItem;
