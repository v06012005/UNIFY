import { Textarea } from "@heroui/react";

export default function TextArea() {

    return (
        <div className="w-full">
            <Textarea
                className=""
                label=""
                labelPlacement="outside"
                placeholder="Enter your comment"
                variant="underlined"
                minRows={2}
            />
        </div>
    );
}
