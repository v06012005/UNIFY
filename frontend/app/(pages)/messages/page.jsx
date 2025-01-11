import Image from "next/image";
import avatar from "@/public/images/testreel.jpg";
import avatar2 from "@/public/images/testAvt.jpg";
import { Input } from "@/components/ui/input";
const Page = () => {
  return (
    <div className="w-full">
      <div className="flex w-full">
        <div className="h-screen basis-1/3 flex flex-col">
          <div className="bg-white shadow-md px-9 py-4 sticky top-0 z-10">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-4xl font-medium">Message</h1>
              <Image
                src={avatar}
                alt="Avatar"
                className="rounded-full w-12 h-12"
              />
            </div>
            <div className="mb-4">
              <Input
                placeholder={"Search..."}
                className={`w-[400px] h-12 border-gray-950 font-bold`}
              />
            </div>
            <div className="w-full flex mt-3 space-x-6 overflow-x-auto">
              <div className="place-items-center text-center">
                <Image
                  src={avatar}
                  alt="Avatar"
                  className="rounded-full w-16 h-16"
                />
                <p className="truncate w-16">Le Tan Vinh</p>
              </div>
              <div className="place-items-center text-center">
                <Image
                  src={avatar}
                  alt="Avatar"
                  className="rounded-full w-16 h-16"
                />
                <p className="truncate w-16">Nguyen Huu Trung</p>
              </div>
              <div className="place-items-center text-center">
                <Image
                  src={avatar}
                  alt="Avatar"
                  className="rounded-full w-16 h-16"
                />
                <p className="truncate w-16">Huynh Thi Thao Vy</p>
              </div>
              <div className="place-items-center text-center">
                <Image
                  src={avatar}
                  alt="Avatar"
                  className="rounded-full w-16 h-16"
                />
                <p className="truncate w-16">Le Minh Dang</p>
              </div>
              <div className="place-items-center text-center">
                <Image
                  src={avatar}
                  alt="Avatar"
                  className="rounded-full w-16 h-16"
                />
                <p className="truncate w-16">Nguyen An Ninh</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-9 py-4 bg-gray-100">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-800 text-white p-4 rounded-lg w-full max-w-md mt-4"
              >
                <div className="flex items-center">
                  <Image
                    src={avatar}
                    alt="Avatar"
                    className="rounded-full w-12 h-12"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-medium truncate w-20">
                      TanVinh
                    </h4>
                    <p className="text-sm text-gray-300 truncate w-60">
                      Làm cho xong giao diện nghe...
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">20:59</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ml-5 basis-2/3 mr-5  ">
          <div className="flex p-4 w-full">
            <div className="flex grow">
              <Image
                src={avatar}
                alt="Avatar"
                className="rounded-full w-14 h-14"
              />
              <div className="ml-5">
                <h4 className="text-lg font-medium truncate w-60">
                  Lê Tấn Vinh
                </h4>
                <p className="text-lg text-gray-700 truncate w-40">TanVinh</p>
              </div>
            </div>
            <div className="flex  w-1/3 justify-end text-2xl">
              <button
                title="Call"
                className="mr-2 p-2 rounded-md hover:bg-gray-200 transition ease-in-out duration-200"
              >
                <i className="fa-solid fa-phone "></i>
              </button>
              <button
                title="Video Call"
                className="mr-2 p-2 rounded-md hover:bg-gray-200 transition ease-in-out duration-200"
              >
                <i className="fa-solid fa-video"></i>
              </button>
            </div>
          </div>
          <hr className=" border-1 border-gray-800" />
          <div className="h-[540] overflow-y-auto">
            <h2 className="text-center m-3">23:48, 20/01/2025</h2>
            <div className="m-4 flex">
              <div className="">
                <Image
                  src={avatar}
                  alt="Avatar"
                  className="rounded-full w-14 h-14"
                />
                <div className="ml-5">
                  <h4 className="text-lg font-medium truncate w-60">
                    Lê Tấn Vinh
                  </h4>
                  <p className="text-lg text-gray-700 truncate w-40">TanVinh</p>
                </div>
              </div>
              <div className="flex  w-1/3 justify-end text-2xl">
                <button className="mr-2 p-2 rounded-md hover:bg-gray-200 transition ease-in-out duration-200">
                  <i className="fa-solid fa-phone "></i>
                </button>
                <button className="mr-2 p-2 rounded-md hover:bg-gray-200 transition ease-in-out duration-200">
                  <i className="fa-solid fa-video"></i>
                </button>
              </div>
            </div>
            <hr className=" border-1 border-gray-800" />
            <div className="h-[540] overflow-y-auto">
              <h2 className="text-center m-3">23:48, 20/01/2025</h2>
              <div className="m-4 flex">
                <div className="">
                  <Image
                    src={avatar}
                    alt="Avatar"
                    className="rounded-full w-14 h-14"
                  />
                </div>
                <div className="ml-3">
                  <h2 className="items-center justify-between bg-gray-800 text-white p-2 rounded-lg mb-2">
                    So I started to walk into the water. I won't lie to you boys,
                    I was terrified
                  </h2>
                  <h2 className="items-center justify-between bg-gray-800 text-white p-2 rounded-lg mb-2">
                    I don't know if it was divine intervention
                  </h2>
                  <h2 className="items-center justify-between bg-gray-800 text-white p-2 rounded-lg mb-2">
                    was divine intervention
                  </h2>
                </div>
              </div>
              <div className="m-4 flex justify-end">
                <div className="ml-3">
                  <h2 className="items-center justify-between bg-gray-800 text-white p-2 rounded-lg mb-2">
                    So I started to walk into the water. I won't lie to you boys,
                    I was terrified
                  </h2>
                  <h2 className="items-center justify-between bg-gray-800 text-white p-2 rounded-lg mb-2">
                    I don't know if it was divine intervention
                  </h2>
                  <h2 className="items-center justify-between bg-gray-800 text-white p-2 rounded-lg mb-2">
                    was divine intervention
                  </h2>
                </div>
              </div>
              <div className="m-4 flex">
                <div className="">
                  <Image
                    src={avatar}
                    alt="Avatar"
                    className="rounded-full w-14 h-14"
                  />
                </div>
                <div className="ml-3">
                  <h2 className="items-center justify-between bg-gray-800 text-white p-2 rounded-lg mb-2">
                    So I started to walk into the water. I won't lie to you boys,
                    I was terrified
                  </h2>
                  <h2 className="items-center justify-between bg-gray-800 text-white p-2 rounded-lg mb-2">
                    I don't know if it was divine intervention
                  </h2>
                  <h2 className="items-center justify-between bg-gray-800 text-white p-2 rounded-lg mb-2">
                    was divine intervention
                  </h2>
                </div>
              </div>
              <div className="m-4 flex">
                <div className="">
                  <Image
                    src={avatar}
                    alt="Avatar"
                    className="rounded-full w-14 h-14"
                  />
                </div>
                <div className="ml-3">
                  <h2 className="items-center justify-between bg-gray-800 text-white p-2 rounded-lg mb-2">
                    So I started to walk into the water. I won't lie to you boys,
                    I was terrified
                  </h2>
                  <h2 className="items-center justify-between bg-gray-800 text-white p-2 rounded-lg mb-2">
                    I don't know if it was divine intervention
                  </h2>
                  <h2 className="items-center justify-between bg-gray-800 text-white p-2 rounded-lg mb-2">
                    was divine intervention
                  </h2>
                </div>
              </div>
              <div className="m-4 flex justify-end">
                <div className="ml-3">
                  <h2 className="items-center justify-between bg-gray-800 text-white p-2 rounded-lg mb-2">
                    So I started to walk into the water. I won't lie to you boys,
                    I was terrified
                  </h2>
                  <h2 className="items-center justify-between bg-gray-800 text-white p-2 rounded-lg mb-2">
                    I don't know if it was divine intervention
                  </h2>
                  <h2 className="items-center justify-between bg-gray-800 text-white p-2 rounded-lg mb-2">
                    was divine intervention
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center bg-gray-800 text-white p-3 rounded-2xl w-full justify-center">
            <Image
              src={avatar2}
              alt="Avatar"
              className="rounded-full w-10 h-10 mr-4"
            />

            <input
              type="text"
              placeholder="Type your message here..."
              className="bg-gray-700 text-white placeholder-gray-400 flex-grow py-2 px-4 rounded-3xl focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
