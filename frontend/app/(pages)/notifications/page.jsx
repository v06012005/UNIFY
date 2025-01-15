import Image from "next/image";
import avatar from "@/public/images/avt.jpg";

const Page = () => {
  return (
    <div className={"min-h-screen w-full flex flex-col justify-start p-10"}>
      <h1 className={"font-extrabold text-3xl font-mono mb-4"}>Notification</h1>
      <div className={"grid place-content-start"}>
        {/* Start */}
        <div
          className={"p-4 bg-gray-100 flex items-center justify-between"}
          style={{ width: 50 + "em" }}
        >
          {/* User Info */}
          <div className={"flex items-center gap-4"} alt="1-user">
            <Image
              src={avatar}
              width={70}
              height={70}
              alt="User"
              className={"rounded-full"}
            />
            <div className={"flex gap-3"}>
              <p className={""}>
                <strong className={"font-black text-xl"}>Username</strong> đã
                follow bạn
              </p>
              <button
                className={
                  "border border-gray-300 rounded-md px-4 py-1 text-sm bg-transparent text-black"
                }
              >
                Đã follow
              </button>
              <button
                className={
                  "bg-gray-500 text-white rounded-md px-4 py-1 text-sm hover:bg-gray-400"
                }
              >
                Follow lại
              </button>
              <button
                className={
                  "bg-gray-500 text-white rounded-md px-4 py-1 text-sm hover:border hover:border-gray-300 hover:text-black hover:bg-transparent"
                }
              >
                Follow lại
              </button>
            </div>
          </div>
          {/* Duration */}
          <div className={"text-gray-400 text-sm"} alt="3-dur">
            <small>30 seconds ago</small>
          </div>
        </div>
        {/* End */}
      </div>
    </div>
  );
};

export default Page;
