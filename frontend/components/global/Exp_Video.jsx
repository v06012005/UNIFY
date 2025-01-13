import Image from "next/image";
import iconReel from "@/public/vds.svg";
import iconComment from "@/public/comment.svg";
import iconHeart from "@/public/heart.svg";

export default function Video() {
  return (
    <div
      className={
        "w-72 h-72 bg-black p-3 group/item hover:bg-opacity-95 cursor-pointer"
      }
    >
      <Image
        src={iconReel}
        width={24}
        height={18}
        alt={"iconReel"}
        className={"float-right"}
      />
      <div
        className={
          "h-full group/edit invisible text-white grid place-content-end float-left group-hover/item:visible"
        }
      >
        <div className={"mb-2"}>
          <Image src={iconHeart} width={20} height={20} alt={"Like"} />
          <p className={"font-bold text-lg ml-1"}>0</p>
        </div>
        <div className={"mt-2"}>
          <Image src={iconComment} width={20} height={20} alt={"comment"} />
          <p className={"font-bold text-lg ml-1"}>0</p>
        </div>
      </div>
    </div>
  );
}
