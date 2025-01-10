import Image from "next/image";
import BlackImage from "@/public/images/A_black_image.jpg";
import iconImg from "@/public/imgs.svg";
import iconReel from "@/public/vds.svg";
const Page = () => {
  return (
    <div className={"w-full h-auto flex flex-wrap my-8 justify-center"}>
      <div className={"grid grid-cols-3 gap-2"}>
        <div className={"w-96 h-96 bg-black p-3"}>
          <Image
            src={iconImg}
            width={24}
            height={18}
            alt={"iconImg"}
            className={"float-right"}
          />
        </div>
        <div className={"w-96 h-96 bg-black p-3"}>
          <Image
            src={iconReel}
            width={24}
            height={18}
            alt={"iconReel"}
            className={"float-right"}
          />
        </div>
        <div className={"w-96 h-96 bg-black p-3"}>
          <Image
            src={iconImg}
            width={24}
            height={18}
            alt={"iconImg"}
            className={"float-right"}
          />
        </div>
        <div className={"w-96 h-96 bg-black p-3"}>
          <Image
            src={iconImg}
            width={24}
            height={18}
            alt={"iconImg"}
            className={"float-right"}
          />
        </div><div className={"w-96 h-96 bg-black p-3"}>
          <Image
            src={iconImg}
            width={24}
            height={18}
            alt={"iconImg"}
            className={"float-right"}
          />
        </div><div className={"w-96 h-96 bg-black p-3"}>
          <Image
            src={iconImg}
            width={24}
            height={18}
            alt={"iconImg"}
            className={"float-right"}
          />
        </div><div className={"w-96 h-96 bg-black p-3"}>
          <Image
            src={iconImg}
            width={24}
            height={18}
            alt={"iconImg"}
            className={"float-right"}
          />
        </div><div className={"w-96 h-96 bg-black p-3"}>
          <Image
            src={iconImg}
            width={24}
            height={18}
            alt={"iconImg"}
            className={"float-right"}
          />
        </div><div className={"w-96 h-96 bg-black p-3"}>
          <Image
            src={iconImg}
            width={24}
            height={18}
            alt={"iconImg"}
            className={"float-right"}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
