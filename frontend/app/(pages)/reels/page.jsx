import Image from "next/image";
import React from "react";
import avatar from "@/public/images/testreel.jpg";
import avatar2 from "@/public/images/testAvt.jpg";

const Reels = () => {
  const reels = Array(10).fill(0);

  return (
    <>
      <div className="relative w-[450px] h-[700px] bg-gray-800 mx-auto rounded-2xl overflow-hidden m-5">
        <div className="absolute inset-0 bg-gray-700 flex justify-center items-center">
          <button className="absolute top-4 right-4 bg-gray-900 text-white rounded-full p-2">
            🔇
          </button>
          <Image src={avatar} alt="Image"></Image>
        </div>

        <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
          <Image
            src={avatar2} alt="Image"
            className="w-10 h-10 bg-gray-600 rounded-full"
          ></Image>
          <div className="flex items-center space-x-2">
            <span className="font-medium">TanVinh</span>
            <button className="bg-gray-600 text-sm px-2 py-1 rounded-md">
              Follow
            </button>
          </div>
        </div>

        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-4 text-white text-2xl">
          <div className="flex flex-col items-center">
            <i className="fa-regular fa-heart"></i>
            <span className="text-sm">47k</span>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-regular fa-comment"></i>
            <span className="text-sm">47k</span>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-regular fa-paper-plane"></i>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-regular fa-bookmark"></i>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-solid fa-ellipsis"></i>
          </div>
        </div>
      </div>
      <div className="relative w-[450px] h-[700px] bg-gray-800 mx-auto rounded-2xl overflow-hidden m-5">
        <div className="absolute inset-0 bg-gray-700 flex justify-center items-center">
          <button className="absolute top-4 right-4 bg-gray-900 text-white rounded-full p-2">
            🔇
          </button>
          <Image src={avatar} alt="Image"></Image>
        </div>

        <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
          <Image
            src={avatar2} alt="Image"
            className="w-10 h-10 bg-gray-600 rounded-full"
          ></Image>
          <div className="flex items-center space-x-2">
            <span className="font-medium">TanVinh</span>
            <button className="bg-gray-600 text-sm px-2 py-1 rounded-md">
              Follow
            </button>
          </div>
        </div>

        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-4 text-white text-2xl">
          <div className="flex flex-col items-center">
            <i className="fa-regular fa-heart"></i>
            <span className="text-sm">47k</span>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-regular fa-comment"></i>
            <span className="text-sm">47k</span>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-regular fa-paper-plane"></i>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-regular fa-bookmark"></i>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-solid fa-ellipsis"></i>
          </div>
        </div>
      </div>
      <div className="relative w-[450px] h-[700px] bg-gray-800 mx-auto rounded-2xl overflow-hidden m-5">
        <div className="absolute inset-0 bg-gray-700 flex justify-center items-center">
          <button className="absolute top-4 right-4 bg-gray-900 text-white rounded-full p-2">
            🔇
          </button>
          <Image src={avatar} alt="Image"></Image>
        </div>

        <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
          <Image
            src={avatar2} alt="Image"
            className="w-10 h-10 bg-gray-600 rounded-full"
          ></Image>
          <div className="flex items-center space-x-2">
            <span className="font-medium">TanVinh</span>
            <button className="bg-gray-600 text-sm px-2 py-1 rounded-md">
              Follow
            </button>
          </div>
        </div>

        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-4 text-white text-2xl">
          <div className="flex flex-col items-center">
            <i className="fa-regular fa-heart"></i>
            <span className="text-sm">47k</span>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-regular fa-comment"></i>
            <span className="text-sm">47k</span>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-regular fa-paper-plane"></i>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-regular fa-bookmark"></i>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-solid fa-ellipsis"></i>
          </div>
        </div>
      </div>
      <div className="relative w-[450px] h-[700px] bg-gray-800 mx-auto rounded-2xl overflow-hidden m-5">
        <div className="absolute inset-0 bg-gray-700 flex justify-center items-center">
          <button className="absolute top-4 right-4 bg-gray-900 text-white rounded-full p-2">
            🔇
          </button>
          <Image alt="Image" src={avatar}></Image>
        </div>

        <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
          <Image alt="Image"
            src={avatar2}
            className="w-10 h-10 bg-gray-600 rounded-full"
          ></Image>
          <div className="flex items-center space-x-2">
            <span className="font-medium">TanVinh</span>
            <button className="bg-gray-600 text-sm px-2 py-1 rounded-md">
              Follow
            </button>
            <Image src={avatar} alt="Image" className="w-full h-full" />
          </div>

          <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
            <Image
              src={avatar2}
              alt="User Avatar"
              className="w-10 h-10 bg-gray-600 rounded-full"
            />
            <div className="flex items-center space-x-2">
              <span className="font-medium">TanVinh</span>
              <button className="bg-gray-600 text-sm px-2 py-1 rounded-md">
                Follow
              </button>
            </div>
          </div>

          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-4 text-white text-2xl">
            <div className="flex flex-col items-center">
              <i className="fa-regular fa-heart text-2xl"></i>
              <span className="text-sm ">47k</span>
            </div>

            <div className="flex flex-col items-center">
              <i className="fa-regular fa-comment text-2xl"></i>
              <span className="text-sm ">47k</span>
            </div>

            <div className="flex flex-col items-center">
              <i className="fa-regular fa-paper-plane text-22xl"></i>
            </div>

            <div className="flex flex-col items-center">
              <i className="fa-regular fa-bookmark text-22xl"></i>
            </div>

            <div className="flex flex-col items-center">
              <i className="fa-solid fa-ellipsis text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-4 text-white text-2xl">
          <div className="flex flex-col items-center">
            <i className="fa-regular fa-heart"></i>
            <span className="text-sm">47k</span>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-regular fa-comment"></i>
            <span className="text-sm">47k</span>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-regular fa-paper-plane"></i>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-regular fa-bookmark"></i>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-solid fa-ellipsis"></i>
          </div>
        </div>
      </div>
      <div className="relative w-[450px] h-[700px] bg-gray-800 mx-auto rounded-2xl overflow-hidden m-5">
        <div className="absolute inset-0 bg-gray-700 flex justify-center items-center">
          <button className="absolute top-4 right-4 bg-gray-900 text-white rounded-full p-2">
            🔇
          </button>
          <Image alt="Image" src={avatar}></Image>
        </div>

        <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
          <Image alt="Image"
            src={avatar2}
            className="w-10 h-10 bg-gray-600 rounded-full"
          ></Image>
          <div className="flex items-center space-x-2">
            <span className="font-medium">TanVinh</span>
            <button className="bg-gray-600 text-sm px-2 py-1 rounded-md">
              Follow
            </button>
          </div>
        </div>

        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-4 text-white text-2xl">
          <div className="flex flex-col items-center">
            <i className="fa-regular fa-heart"></i>
            <span className="text-sm">47k</span>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-regular fa-comment"></i>
            <span className="text-sm">47k</span>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-regular fa-paper-plane"></i>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-regular fa-bookmark"></i>
          </div>

          <div className="flex flex-col items-center">
            <i className="fa-solid fa-ellipsis"></i>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reels;
