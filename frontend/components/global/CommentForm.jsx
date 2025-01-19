import React from "react";
import { Form, Input, Button, Textarea } from "@heroui/react";

export default function CommentForm({ action = "", placeholder = "Write your comment here" }) {
    const [submitted, setSubmitted] = React.useState(null);

    const onSubmit = (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));

        setSubmitted(data);
    };

    return (
        <Form className="w-full flex flex-row" validationBehavior="native" action={action} onSubmit={onSubmit}>
            <Textarea className="flex-grow"
                placeholder={placeholder} minRows={1} variant="underlined"
            />
            <Button type="submit" variant="bordered">
                Post
            </Button>
        </Form>
    );
}

