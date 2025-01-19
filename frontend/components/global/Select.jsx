"use client"

import { Select, SelectItem } from "@heroui/react";

export default function SelectMenu() {
    return (
        <div className="flex w-full flex-wrap md:flex-nowrap">
            <Select defaultSelectedKeys={["en"]} className="w-full" label="" variant="underlined">
                <SelectItem key={"en"}>English</SelectItem>
                <SelectItem key={"vi"}>Vietnamese</SelectItem>
            </Select>
        </div>
    );
}
