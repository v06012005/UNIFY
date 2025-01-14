import Image from "next/image";

const Page = () => {
  return (
    <div className={"min-h-screen w-full flex flex-col justify-center"}>
      <div className={"grid gap-5 place-content-center bg-black"}>
        {/* Start */}
        <div>
          <h2 className={"text-white"}>Thông báo</h2>
          <table></table>
        </div>
        {/* End */}
      </div>
    </div>
  );
};

export default Page;
