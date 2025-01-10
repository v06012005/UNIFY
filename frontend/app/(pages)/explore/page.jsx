import Image from "next/image";
import BlackImage from "@/public/images/A_black_image.jpg";
import iconImg from "@/public/imgs.svg";
import iconReel from "@/public/vds.svg";
const Page = () => {
  return (
    <div className={"w-full h-auto flex flex-wrap mt-8 justify-center"}>
      <div className={"grid grid-cols-3 gap-2"}>
        <div
          className={"w-96 h-96 p-3"}
          style={{ backgroundImage: BlackImage }}
        >
            <Image
            src={iconImg} width={24} height={18} className={"float-right"}/>
        </div>
        <div
          className={"w-96 h-96"}
          style={{ backgroundImage: BlackImage }}
        >
            <Image
            src={iconReel} width={24} height={18} className={"float-right"}/>
        </div>
        <div
          className={"w-96 h-96"}
          style={{ backgroundImage: BlackImage }}
        >
            
        </div>
        <div
          className={"w-96 h-96"}
          style={{ backgroundImage: BlackImage }}
        >
            
        </div>
      </div>
    </div>
  );
};

export default Page;
