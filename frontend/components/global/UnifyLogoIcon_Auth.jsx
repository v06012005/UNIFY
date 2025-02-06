"use client";

import Image from "next/image";
import light from "@/public/images/unify_icon.svg";
import dark from "@/public/images/unify_icon_2.svg";
import { useTheme } from "next-themes";

const UnifyLogoIcon = () => {
  const { theme, setTheme } = useTheme();
  console.log(theme);
  return (
    <Image
      src={theme == "dark" ? dark : light}
      alt={"Logo"}
      height={200}
      width={200}
      priority="logo"
      className={`mr-7 w-48 h-48`}
    />
  );
};

export default UnifyLogoIcon;
