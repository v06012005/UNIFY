import { Card, CardFooter, Button } from "@heroui/react";
import Image from "next/image";
import LikeButton from "@/components/global/LikeButton";
import Content from "@/components/comments/Content";
import { formatDistanceToNow } from "date-fns";
import defaultAvatar from "public/images/unify_icon_2.svg";

const Reply = ({ reply, currentUserId, onReplySubmit, onReplyClick }) => {
  return (
    <div className="w-full flex items-center">
      <p className="dark:text-white ml-4 mr-4 text-center">
        <i className="fa-solid fa-arrow-turn-up rotate-90"></i>
      </p>
      <Card
        key={reply.id}
        className="overflow-visible w-11/12 my-2 border-none bg-transparent shadow-none"
      >
        <div className="">
          <div className="flex items-center">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-gray-300">
              {reply.avatarUrl ? (
                <Image
                  src={reply.avatarUrl}
                  alt={`${reply.username || "Unknown"}'s avatar`}
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
            <h4 className="text-base font-bold truncate max-w-full w-fit px-2">
              {reply.username || "Unknown"}
            </h4>
            <h4 className="text-xs truncate w-32 dark:text-gray-500">
              {reply.commentedAt &&
              !isNaN(new Date(reply.commentedAt).getTime())
                ? formatDistanceToNow(new Date(reply.commentedAt), {
                    addSuffix: true,
                  })
                : "Vừa xong"}
            </h4>
          </div>
          <div className="indent-12">
            <Content text={reply.content} className="" />
          </div>
        </div>

        <CardFooter className="flex flex-row justify-end py-1">
          <LikeButton className="!text-sm space-x-1" />

          <Button
            size="sm"
            className="bg-transparent dark:text-white"
            onPress={() => onReplyClick(reply)} // Truyền reply cho cấp 2
          >
            <i className="fa-solid fa-reply"></i> Reply
          </Button>
          <Button
            size="sm"
            className="bg-transparent dark:text-white"
            startContent={<i className="fa-solid fa-ellipsis"></i>}
          >
            More
          </Button>
        </CardFooter>

        <hr className="dark:border-neutral-700" />
      </Card>
    </div>
  );
};

export default Reply;
