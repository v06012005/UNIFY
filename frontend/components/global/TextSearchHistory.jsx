<<<<<<< HEAD
import { UserSearch, X } from "lucide-react";

const TextSearchHistory = ({ text }) => {
  return (
    <div className={`w-full h-12 flex items-center gap-3`}>
      <UserSearch size={40} />
      <div className={`grid`}>
        <span className={`text-md`}>{text}</span>
      </div>
      <div className={`ml-auto cursor-pointer`}>
        <X />
      </div>
    </div>
  );
};

export default TextSearchHistory;
=======
import {UserSearch, X} from "lucide-react";

const TextSearchHistory = ({text}) => {
    return (
        <div className={`w-full h-12 flex items-center gap-3`}>
            <UserSearch size={40}/>
            <div className={`grid`}>
                <span className={`text-md`}>{text}</span>
            </div>
            <div className={`ml-auto cursor-pointer`}>
                <X/>
            </div>
        </div>
    )
}

export default TextSearchHistory;
>>>>>>> e240531 (add search)
