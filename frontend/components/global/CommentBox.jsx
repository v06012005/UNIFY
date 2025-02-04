import React, { useState } from "react";
import { Form, Input, Button, Textarea } from "@heroui/react";
import Image from "next/image";
import SendButton from "@/public/images/send.png";

export default function CommentBox({
  action = "",
  placeholder = "Write your comment here",
}) {
  const [submitted, setSubmitted] = React.useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    setSubmitted(data);
  };

  return (
    <Form
      className="w-full flex flex-row"
      validationBehavior="native"
      action={action}
      onSubmit={onSubmit}
    >
      <Textarea
        className="flex-grow"
        onValueChange={(s) => {
          setIsTyping(s !== "");
        }}
        placeholder={placeholder}
        minRows={1}
        variant="underlined"
      />
      <Button
        type="submit"
        size="sm"
        color="success"
        disabled={!isTyping}
        className={`${isTyping ? "" : "opacity-35 pointer-events-none"} my-auto bg-transparent`}
      >
        <Image src={SendButton} className="w-6 h-auto" alt="Send"/>
      </Button>
    </Form>
  );
}
