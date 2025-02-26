import { Card, CardFooter, Button } from "@heroui/react";
import Image from "next/image";
import LikeButton from "@/components/global/LikeButton";
import avatar2 from "@/public/images/testAvt.jpg";
import Content from "@/components/comments/Content";

const Reply = () => {
  return (
    <div className="w-full flex items-center">
      <p className="dark:text-white w-4/12 text-center">
        <i className="fa-solid fa-arrow-turn-up rotate-90"></i>
      </p>
      <Card className="overflow-visible w-11/12 my-2 border-none bg-transparent shadow-none ">
        <div className="">
          <div className="flex items-center">
            <Image
              src={avatar2}
              alt="User avatar"
              className="rounded-full w-12 h-12"
            />
            <h4 className="text-lg font-bold truncate w-20 pl-2 ">TanVinh</h4>
          </div>
          <div className="ml-2">
            <Content
              text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed quibusdam, ex maiores amet alias dolor minima magnam quis totam molestias consectetur laudantium possimus et asperiores? Dignissimos minima animi omnis sed! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe, id repellat minus labore esse eligendi maiores asperiores? Architecto dolorem veritatis, totam nam, molestiae quo quis asperiores qui nostrum animi possimus?`}
            />
          </div>
        </div>

        <CardFooter className="flex flex-row justify-end">
          <LikeButton className="!text-sm" />
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
      </Card>
    </div>
  );
};

export default Reply;
