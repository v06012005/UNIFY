"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import light from "@/public/images/unify_1.svg";
import dark from "@/public/images/unify_darkmode_full.svg";
import { useTheme } from "next-themes";

const UnifyLogo = ({ className = "" }) => {
  const { theme, setTheme } = useTheme();

  return (
    <Image
      src={theme === "dark" ? dark : light}
      alt="Unify Logo"
      className={className}
      width={200}
      height={200}
    />
  );
};

export default UnifyLogo;
