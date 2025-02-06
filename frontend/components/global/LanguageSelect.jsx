"use client";

import { Select, SelectItem } from "@heroui/react";
import { Avatar } from "@heroui/react";

export default function SelectMenu() {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap">
      <Select
        defaultSelectedKeys={["en"]}
        className="w-full"
        label=""
        variant="underlined"
      >
        <SelectItem
          key={"en"}
          startContent={<Avatar alt="US Flag" src="/images/us.png" />}
        >
          English
        </SelectItem>
        <SelectItem
          key={"vi"}
          startContent={<Avatar alt="Vietnam Flag" src="/images/vn.png" />}
        >
          Vietnamese
        </SelectItem>
      </Select>
    </div>
  );
}
