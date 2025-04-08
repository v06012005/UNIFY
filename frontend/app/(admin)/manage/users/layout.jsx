import React from "react";
import UserSidebar from "./components/UserSidebar";

const layout = ({ children }) => {
  return (
    <div className="flex">
      <div className="">{children}</div>
    </div>
  );
};

export default layout;
