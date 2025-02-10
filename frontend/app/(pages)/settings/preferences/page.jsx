import React from "react";
import ModeSwitch from "@/components/global/ModeSwitch";
import SelectMenu from "@/components/global/LanguageSelect";

const languages = [
  {
    id: 1,
    name: "English",
  },
  {
    id: 2,
    name: "Vietnamese",
  },
];

const page = () => {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-5">Preferences</h1>
      <div className="my-5">
        <p className="text-xl font-bold">App theme</p>
        <p className="text-gray-500">
          Set how your app should look like with your prefered theme.
        </p>
        <div className="my-2 border rounded-md p-2">
          <ModeSwitch />
        </div>
      </div>
      <div className="my-5">
        <p className="text-xl font-bold">Prefered language</p>
        <p className="text-gray-500">
          See all texts, messages, titles in your prefered language.
        </p>
        <div className="my-2 w-full">
          <SelectMenu />
        </div>
      </div>
    </div>
  );
};

export default page;
