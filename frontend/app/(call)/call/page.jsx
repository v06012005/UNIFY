import avatar2 from "@/public/images/testAvt.jpg";
import Image from "next/image";
const Call = () => {
  return (
    <>
      <div className="w-full bg-black h-screen flex flex-col">
        <div className="p-4 flex">
          <div className="mr-4 ">
            <Image
              src={avatar2}
              alt="avtcall"
              className="w-16 h-16 rounded-full"
            ></Image>
          </div>
          <div className="">
            <h1 className="text-2xl font-medium text-white">Le Tan Vinh</h1>
            <p className="text-white">TanVinh</p>
          </div>
        </div>
        <div className="flex-grow"></div>
        <div className="flex justify-center gap-4  mb-8">
          <button className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-500 hover:bg-gray-600">
            <i className="fas fa-microphone text-white text-2xl"></i>
          </button>
          <button className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-500 hover:bg-gray-600">
            <i className="fa-solid fa-video-slash text-white text-2xl"></i>
          </button>
          <button className="w-16 h-16 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700">
            <i className="fas fa-phone-slash text-white text-2xl"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default Call;
