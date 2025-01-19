import { Textarea } from "@heroui/react";

export default function TextArea({ className = "", label = "", placeholder = "", variant = "underlined", minRows = 2 }) {

    return (
        <div className="w-full">
            <Textarea
                className={className}
                label={label}
                labelPlacement="outside"
                placeholder={placeholder}
                variant={variant}
                minRows={minRows}
            />
        </div>
    );
}
