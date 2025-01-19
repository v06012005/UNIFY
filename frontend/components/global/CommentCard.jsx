import { Card, CardHeader, CardBody, CardFooter, Divider, Link, User, Button } from "@heroui/react";
import LikeButton from "./LikeButton";
import { useState } from "react";

const Reply = () => {
    return (
        <div className="w-full flex items-center">
            <p className="text-white w-1/12 text-center"><i className="fa-solid fa-arrow-turn-up rotate-90"></i></p>
            <Card className="overflow-visible w-11/12 my-2 ">
                <CardHeader className="flex gap-3">
                    <User
                        avatarProps={{
                            src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                        }}
                        description={""}
                        name="Junior Garcia"
                    />
                </CardHeader>
                <CardBody>
                    <p className="text-sm">Make beautiful websites regardless of your design experience.</p>
                </CardBody>
                <Divider />
                <CardFooter className="flex flex-row items-center justify-end">
                    <LikeButton className="!text-sm" />
                    <Button size="sm" className="bg-transparent"><i className="fa-solid fa-reply"></i>Reply</Button>
                    <Button size="sm" className="bg-transparent" startContent={<i className="fa-solid fa-ellipsis"></i>}>More</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default function CommentCard() {
    const [isShown, setIsShown] = useState(false);

    const handleClick = () => {
        setIsShown(!isShown);
    }

    return (
        <>
            <Card className="overflow-visible">
                <CardHeader className="flex gap-3">
                    <User
                        avatarProps={{
                            src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                        }}
                        description={""}
                        name="Junior Garcia"
                    />
                </CardHeader>
                <CardBody>
                    <p className="text-sm">Make beautiful websites regardless of your design experience.</p>
                </CardBody>
                <Divider />
                <CardFooter className="flex flex-row items-center justify-end">
                    <LikeButton className="!text-sm" />
                    <Button size="sm" className="bg-transparent"><i className="fa-solid fa-reply"></i>Reply</Button>
                    <Button onPress={handleClick} size="sm" className="bg-transparent"><i class="fa-solid fa-comments"></i>Show Replies</Button>
                    <Button size="sm" className="bg-transparent" startContent={<i className="fa-solid fa-ellipsis"></i>}>More</Button>
                </CardFooter>
            </Card>
            {isShown && <>
                <div className="w-full flex flex-col items-end">
                    <Reply />
                    <Reply />
                </div>
            </>}
        </>
    );
}
