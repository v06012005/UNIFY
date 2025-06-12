import { Card, CardFooter, Button } from "@heroui/react";
import Image from "next/image";
import LikeButton from "@/components/global/LikeButton";
import Content from "@/components/comments/Content";
import { formatDistanceToNow } from "date-fns";
import defaultAvatar from "public/images/unify_icon_2.svg";

const Reply = ({ reply, currentUserId, onReplySubmit, onReplyClick }) => {
  return (
    <div className="w-full flex items-start gap-2 pl-8 border-l-2 border-gray-200 dark:border-neutral-700 bg-gray-50/60 dark:bg-neutral-800/40 rounded-lg mb-2">
      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700 mt-1">
        {reply.avatarUrl ? (
          <Image
            src={reply.avatarUrl}
            alt={`${reply.username || "Unknown"}'s avatar`}
            width={32}
            height={32}
            className="object-cover w-full h-full"
          />
        ) : (
          <Image
            src={defaultAvatar}
            alt="Default Avatar"
            width={32}
            height={32}
            className="object-cover w-full h-full"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-gray-900 dark:text-gray-100 truncate max-w-[100px]">{reply.username || "Unknown"}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {reply.commentedAt && !isNaN(new Date(reply.commentedAt).getTime())
              ? formatDistanceToNow(new Date(reply.commentedAt), { addSuffix: true })
              : "Just now"}
          </span>
        </div>
        <div className="mt-1 text-xs text-gray-800 dark:text-gray-200 break-words">
          <Content text={reply.content} className="leading-snug" />
        </div>
        <div className="flex gap-2 mt-1">
          <Button
            size="sm"
            className="bg-transparent text-xs px-2 py-1 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-gray-300"
            onPress={() => onReplyClick(reply)}
            aria-label="Reply to reply"
          >
            <i className="fa-solid fa-reply mr-1"></i>Reply
          </Button>
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
  );
};

export default Reply;
