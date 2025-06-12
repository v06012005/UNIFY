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
      className="overflow-visible border-none bg-transparent shadow-none p-0 mb-2"
    >
      <div className="flex items-start gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700">
          {comment.avatarUrl ? (
            <Image
              src={comment.avatarUrl}
              alt={`${comment.username || "Unknown"}'s avatar`}
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
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate max-w-[120px]">{comment.username || "Unknown"}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {comment.commentedAt && !isNaN(new Date(comment.commentedAt).getTime())
                ? formatDistanceToNow(new Date(comment.commentedAt), { addSuffix: true })
                : "Just now"}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-800 dark:text-gray-200 break-words">
            <Content text={comment.content} className="leading-snug" />
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              className="bg-transparent text-xs px-2 py-1 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-gray-300"
              onPress={() => onReplyClick(comment)}
              aria-label="Reply to comment"
            >
              <i className="fa-solid fa-reply mr-1"></i>Reply
            </Button>
            {comment.replies && comment.replies.length > 0 && (
              <Button
                onPress={() => setIsShown(!isShown)}
                size="sm"
                className="bg-transparent text-xs px-2 py-1 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-gray-300"
                aria-label={isShown ? "Hide replies" : "Show replies"}
              >
                <i className="fa-solid fa-comments mr-1"></i>
                {isShown ? "Hide Replies" : `Show Replies (${allReplies.length})`}
              </Button>
            )}
            <Button
              size="sm"
              className="bg-transparent text-xs px-2 py-1 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-gray-300"
              startContent={<i className="fa-solid fa-ellipsis"></i>}
              aria-label="More actions"
            >
              More
            </Button>
          </div>
        </div>
      </div>
      {isShown && allReplies.length > 0 && (
        <div className="w-full flex flex-col items-end mt-2 pl-8 border-l-2 border-gray-200 dark:border-neutral-700 bg-gray-50/60 dark:bg-neutral-800/40 rounded-lg">
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
