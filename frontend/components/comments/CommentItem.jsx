"use client";

import { Card, CardFooter, Button } from "@heroui/react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import Reply from "@/components/comments/Reply";
import Content from "@/components/comments/Content";
import LikeButton from "@/components/global/LikeButton";
import avatar2 from "@/public/images/testAvt.jpg";

//////////
const CommentItem = ({ comment }) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <Card
      key={comment.id}
      className="overflow-visible border-none bg-transparent shadow-none p-3 m-4"
    >
      <div>
        <div className="flex items-center">
          <Image
            src={avatar2}
            alt="User avatar"
            className="rounded-full w-12 h-12"
          />
          <h4 className="text-base font-bold truncate w-28 pl-2">
            {comment.username}
          </h4>
          <h4 className="text-xs  truncate w-32 dark:text-gray-500">
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

      <CardFooter className="flex flex-row justify-end ">
        <LikeButton className="!text-sm" />
        <Button size="sm" className="bg-transparent dark:text-white">
          <i className="fa-solid fa-reply"></i> Reply
        </Button>
        <Button
          onClick={() => setIsShown(!isShown)}
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
            <Reply key={reply.id} reply={reply} />
          ))}
        </div>
      )}
    </Card>
  );
};

export default CommentItem;
