import { Card, CardFooter, Button } from "@heroui/react";
import Image from "next/image";
import LikeButton from "@/components/global/LikeButton";
import avatar2 from "@/public/images/testAvt.jpg";
import Content from "@/components/comments/Content";
import { formatDistanceToNow } from "date-fns";
const Reply = ({ reply }) => {
  return (
    <div className="w-full flex items-center">
      <p className="dark:text-white ml-4 mr-4 text-center">
        <i className="fa-solid fa-arrow-turn-up rotate-90"></i>
      </p>
      <Card
        key={reply.id}
        className="overflow-visible w-11/12 my-2 border-none bg-transparent shadow-none "
      >
        <div className="">
          <div className="flex items-center">
            <Image
              src={avatar2}
              alt="User avatar"
              className="rounded-full w-11 h-11"
            />
            <h4 className="text-base font-bold truncate max-w-full w-fit px-2">
              {reply.username}
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
            <Content text={reply.content} className=""/>
          </div>
        </div>

        <CardFooter className="flex flex-row justify-end py-1">
          <LikeButton className="!text-sm space-x-1" />
          <Button size="sm" className="bg-transparent dark:text-white">
            <i className="fa-solid fa-reply"></i>Reply
          </Button>
          <Button
            size="sm"
            className="bg-transparent dark:text-white"
            startContent={<i className="fa-solid fa-ellipsis"></i>}
          >
            More
          </Button>
        </CardFooter>
        <hr></hr>
      </Card>
    </div>
  );
};

export default Reply;
