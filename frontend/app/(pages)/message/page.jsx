import Image from "next/image";
import avatar from "@/public/images/testreel.jpg";
import { Input } from "@/components/ui/input";
const Page = () => {
  return (
    <>
      <div className="flex w-full">
        <div className="h-screen flex flex-col">
          <div className="bg-white shadow-md px-9 py-4 sticky top-0 z-10">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-5xl font-medium">Message</h1>
              <Image
                src={avatar}
                alt="Avatar"
                className="rounded-full w-12 h-12"
              />
            </div>
            <div className="mb-4">
              <Input
                placeholder={"Search..."}
                className={`w-[400px] h-12 border-gray-950`}
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
        <div className="ml-5 mr-5">
          <div className="flex p-4">
            <Image
              src={avatar}
              alt="Avatar"
              className="rounded-full w-14 h-14"
            />
            <div className="ml-5">
              <h4 className="text-lg font-medium truncate w-60">Lê Tấn Vinh</h4>
              <p className="text-lg text-gray-700 truncate w-40">
               TanVinh
              </p>
            </div>
          </div>
          <hr className="mt-2 border-1 border-gray-800" />

        </div>
      </div>
    </>
  );
};

export default Page;
