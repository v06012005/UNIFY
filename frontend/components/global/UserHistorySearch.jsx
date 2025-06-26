import Image from "next/image";
import Link from "next/link";

const UserHistorySearch = ({ avatar, username, profile }) => {
  return (
    
      <div className={`w-full flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2 transition-all duration-300 ease-in-out transform hover:scale-[1.02]`}>
        <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden">
          <Image
            src={avatar}
            alt={username}
            fill
            className="object-cover"
          />
        </div>
        <div className={`grid`}>
          <span className={`text-sm font-bold`}>{username}</span>
          <span className={`text-sm`}>{profile}</span>
        </div>
      </div>
    
  );
};

export default UserHistorySearch;

