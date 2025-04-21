import { Card, CardFooter, Button } from "@heroui/react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import Reply from "@/components/comments/Reply";
import Content from "@/components/comments/Content";
import LikeButton from "@/components/global/LikeButton";
import defaultAvatar from "public/images/unify_icon_2.svg";

// Hàm duyệt đệ quy để lấy tất cả replies phẳng
const flattenReplies = (replies) => {
  let flatList = [];
  const recurse = (replyArray) => {
    replyArray.forEach((reply) => {
      flatList.push(reply);
      if (reply.replies && reply.replies.length > 0) {
        recurse(reply.replies);
      }
    });
  };
  recurse(replies);
  return flatList;
};

const CommentItem = ({
  comment,
  currentUserId,
  onReplySubmit,
  onReplyClick,
}) => {
  const [isShown, setIsShown] = useState(false);
  // Lấy tất cả replies phẳng (cấp 2, 3, 4...)
  const allReplies = comment.replies ? flattenReplies(comment.replies) : [];

  return (
    <Card
      key={comment.id}
      className="overflow-visible border-none bg-transparent shadow-none p-3"
    >
      <div>
        <div className="flex items-center">
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
            className="leading-snug text-sm dark:text-gray-200 w-fit max-w-full"
          />
        </div>
      </div>

      <CardFooter className="flex flex-row justify-end p-0">
        {/* <LikeButton className="!text-sm space-x-1" /> */}
        <Button
          size="sm"
          className="bg-transparent dark:text-white"
          onPress={() => onReplyClick(comment)}
        >
          <i className="fa-solid fa-reply"></i> Reply
        </Button>
        {comment.replies && comment.replies.length > 0 && (
          <Button
            onPress={() => setIsShown(!isShown)}
            size="sm"
            className="bg-transparent dark:text-white"
          >
            <i className="fa-solid fa-comments"></i>{" "}
            {isShown ? "Hide Replies" : `Show Replies (${allReplies.length})`}
          </Button>
        )}
        <Button
          size="sm"
          className="bg-transparent dark:text-white"
          startContent={<i className="fa-solid fa-ellipsis"></i>}
        >
          More
        </Button>
      </CardFooter>

      {isShown && allReplies.length > 0 && (
        <div className="w-full flex flex-col items-end">
          {allReplies.map((reply) => (
            <Reply
              key={reply.id}
              reply={reply}
              currentUserId={currentUserId}
              onReplySubmit={onReplySubmit}
              onReplyClick={onReplyClick}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default CommentItem;
