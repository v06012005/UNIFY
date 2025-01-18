"use client";
import { useState } from "react";
import Image from "next/image";
import iconImg from "@/public/imgs.svg";
import iconHeart from "@/public/heart.svg";
import iconComment from "@/public/comment.svg";
import testImg from "@/public/images/testAvt.jpg";
import avatar from "@/public/images/avt.jpg"
import Link from "next/link";

export default function Picture() {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <div
        onClick={toggleModal}
        className={
          "w-72 h-72 bg-black p-3 group/item hover:bg-opacity-95 cursor-pointer"
        }
      >
        <Image
          src={iconImg}
          width={24}
          height={18}
          alt={"iconImg"}
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

      {isModalVisible && (
        <div
          className={
            "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          }
        >
          <div className="bg-white shadow-lg h-[710px] flex">
            <div alt="img">
              <Image src={testImg} className={"w-[568px]"} alt="PostImage" />
            </div>
            <div
              className={"w-[500] flex flex-col justify-between"}
              alt="cmtlikeshare"
            >
              <div className={"h-[60px] p-3 border-b flex items-center justify-between"}>
                <div className={"flex items-center gap-2"}>
                  <Image
                  src={avatar}
                  className={"size-10 text-lg rounded-full"}
                  alt=""
                  />
                  <b>Username</b>
                  <p className="text-black text-xl">
                  •
                  </p>
                  <Link href="#" className={"font-bold text-blue-600"}>Follow</Link>
                </div>
                <div>...</div>
              </div>
              <div className={"p-3 h-[510px]"}>
                Khung bình luận của bài viết
              </div>
              <div className={"h-[83px] p-3 border-t "}>
                Khung tương tác của bài viết
              </div>
              <div className={"h-[56px] p-3 border-t"}>
                Khung comment của người dùng
              </div>
            </div>
          </div>
          <button
            onClick={toggleModal}
            className="absolute top-3 right-3 text-4xl text-gray-200 hover:text-black"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}
