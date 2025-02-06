import Image from "next/image";
import { X } from "lucide-react";

const UserHistorySearch = ({ avatar, username, profile, followers }) => {
  return (
    <div className={`w-full h-12 flex items-center gap-3`}>
      <Image
        src={avatar}
        alt={"img"}
        width={60}
        height={60}
        className={`rounded-full`}
      />
      <div className={`grid`}>
        <span className={`text-sm font-bold`}>{username}</span>
        <span className={`text-sm`}>{profile}</span>
        <span className={`text-[12px] text-gray-900-`}>
          {followers} followers
        </span>
      </div>
      <div className={`ml-auto cursor-pointer`}>
        <X />
      </div>
    </div>
  );
};

export default UserHistorySearch;

