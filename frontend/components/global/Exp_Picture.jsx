"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import iconImg from "@/public/imgs.svg";
import iconHeart from "@/public/heart.svg";
import iconComment from "@/public/comment.svg";
import testImg from "@/public/images/testAvt.jpg";
import avatar from "@/public/images/avt.jpg";
import Link from "next/link";
import HeartButton from "../ui/heart-button";
import CommentButton from "../ui/comment-button";
import ShareButton from "../ui/share-button";
import BookmarkButton from "../ui/bookmark-button";
import CommentBox from "./CommentBox";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Picture() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const popupRef = useRef(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const togglePopup = () => {
    setPopupVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOver = (event) => {
      if (
        isPopupVisible &&
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        setPopupVisible(false);
      }
    };
    document.addEventListener("click", handleClickOver);
    return () => {
      document.removeEventListener("click", handleClickOver);
    };
  }, [isPopupVisible]);

  return (
    <>
      <div
        onClick={toggleModal}
        className={
          "w-72 h-72 p-3 group/item hover:bg-opacity-95 cursor-pointer"
        }
        style={{
          backgroundImage: `url(${testImg.src})`,
          backgroundPosition: "center",
          backgroundSize: "100%",
          backgroundRepeat: "no-repeat",
        }}
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
            <div className="border-r" alt="img">
              <Image src={testImg} className={"w-[568px]"} alt="PostImage" />
            </div>
            <div
              className={
                "w-[500] flex flex-col justify-between dark:bg-black dark:text-white"
              }
            >
              <div
                className={
                  "h-[60px] py-3 px-4 border-b border-l rounded-lg flex items-center justify-between"
                }
              >
                <div className={"flex items-center gap-3"}>
                  <Image
                    src={avatar}
                    className={"size-10 text-lg rounded-full"}
                    alt=""
                  />
                  <b>Username</b>
                  <p className="text-xl">•</p>
                  <Link href="#" className={"font-bold text-blue-600"}>
                    Follow
                  </Link>
                </div>
                <div className="flex">
                  <i
                    class="fas fa-ellipsis-h hover:opacity-75 hover:cursor-pointer transition"
                    onClick={togglePopup}
                  ></i>
                  {isPopupVisible && (
                    <div
                      ref={popupRef}
                      className={`${isPopupVisible == (false) ? "animate-fadeOutCenter" : "animate-fadeInCenter"} fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transform`}
                      onClick={() => setPopupVisible(false)}
                    >
                      <div
                        className="w-[400px] bg-zinc-800 py-1 rounded-3xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ul className="text-sm">
                          <li className="cursor-pointer font-bold text-red-500 text-center py-3 border-b border-gray-600 last:border-0">
                            Report
                          </li>
                          <li className="cursor-pointer font-bold text-white text-center py-3 border-b border-gray-600 last:border-0">
                            Go to post
                          </li>
                          <li className="cursor-pointer font-bold text-white text-center py-3 border-b border-gray-600 last:border-0">
                            Share to...
                          </li>
                          <li className="cursor-pointer font-bold text-white text-center py-3 border-b border-gray-600 last:border-0">
                            Copy link
                          </li>
                          <li className="cursor-pointer font-bold text-white text-center py-3 border-b border-gray-600 last:border-0">
                            Embed
                          </li>
                          <li className="cursor-pointer font-bold text-white text-center py-3 border-b border-gray-600 last:border-0">
                            About this account
                          </li>
                          <li className="cursor-pointer font-bold text-white text-center py-3 border-b border-gray-600 last:border-0">
                            Cancel
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                </div>
              </div>
              <div
                className={
                  "p-4 h-[510px] border-l flex flex-col gap-4 overflow-auto"
                }
                alt="commentBox"
              >
                <div className={"flex items-center"}>
                  <Image
                    src={avatar}
                    className={"size-10 text-lg rounded-full"}
                    alt=""
                  />
                  <div className="grid grid-rows-2 ml-4">
                    <div className="flex gap-1">
                      <h6 className="font-bold">@tagname</h6>
                      <p>comment</p>
                    </div>
                    <div className="flex gap-3 items-end">
                      <small className="text-gray-400">6d</small>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          15 likes
                        </small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">Reply</small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          See translation
                        </small>
                      </Link>
                      <Link href={"#"} className="opacity-75 hover:opacity-100">
                        <small>
                          <i class="fas fa-ellipsis-h"></i>
                        </small>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={"flex items-center"}>
                  <Image
                    src={avatar}
                    className={"size-10 text-lg rounded-full"}
                    alt=""
                  />
                  <div className="grid grid-rows-2 ml-4">
                    <div className="flex gap-1">
                      <h6 className="font-bold">@tagname</h6>
                      <p>comment</p>
                    </div>
                    <div className="flex gap-3 items-end">
                      <small className="text-gray-400">6d</small>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          15 likes
                        </small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">Reply</small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          See translation
                        </small>
                      </Link>
                      <Link href={"#"} className="opacity-75 hover:opacity-100">
                        <small>
                          <i class="fas fa-ellipsis-h"></i>
                        </small>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={"flex items-center"}>
                  <Image
                    src={avatar}
                    className={"size-10 text-lg rounded-full"}
                    alt=""
                  />
                  <div className="grid grid-rows-2 ml-4">
                    <div className="flex gap-1">
                      <h6 className="font-bold">@tagname</h6>
                      <p>comment</p>
                    </div>
                    <div className="flex gap-3 items-end">
                      <small className="text-gray-400">6d</small>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          15 likes
                        </small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">Reply</small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          See translation
                        </small>
                      </Link>
                      <Link href={"#"} className="opacity-75 hover:opacity-100">
                        <small>
                          <i class="fas fa-ellipsis-h"></i>
                        </small>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={"flex items-center"}>
                  <Image
                    src={avatar}
                    className={"size-10 text-lg rounded-full"}
                    alt=""
                  />
                  <div className="grid grid-rows-2 ml-4">
                    <div className="flex gap-1">
                      <h6 className="font-bold">@tagname</h6>
                      <p>comment</p>
                    </div>
                    <div className="flex gap-3 items-end">
                      <small className="text-gray-400">6d</small>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          15 likes
                        </small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">Reply</small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          See translation
                        </small>
                      </Link>
                      <Link href={"#"} className="opacity-75 hover:opacity-100">
                        <small>
                          <i class="fas fa-ellipsis-h"></i>
                        </small>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={"flex items-center"}>
                  <Image
                    src={avatar}
                    className={"size-10 text-lg rounded-full"}
                    alt=""
                  />
                  <div className="grid grid-rows-2 ml-4">
                    <div className="flex gap-1">
                      <h6 className="font-bold">@tagname</h6>
                      <p>comment</p>
                    </div>
                    <div className="flex gap-3 items-end">
                      <small className="text-gray-400">6d</small>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          15 likes
                        </small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">Reply</small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          See translation
                        </small>
                      </Link>
                      <Link href={"#"} className="opacity-75 hover:opacity-100">
                        <small>
                          <i class="fas fa-ellipsis-h"></i>
                        </small>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={"flex items-center"}>
                  <Image
                    src={avatar}
                    className={"size-10 text-lg rounded-full"}
                    alt=""
                  />
                  <div className="grid grid-rows-2 ml-4">
                    <div className="flex gap-1">
                      <h6 className="font-bold">@tagname</h6>
                      <p>comment</p>
                    </div>
                    <div className="flex gap-3 items-end">
                      <small className="text-gray-400">6d</small>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          15 likes
                        </small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">Reply</small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          See translation
                        </small>
                      </Link>
                      <Link href={"#"} className="opacity-75 hover:opacity-100">
                        <small>
                          <i class="fas fa-ellipsis-h"></i>
                        </small>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={"flex items-center"}>
                  <Image
                    src={avatar}
                    className={"size-10 text-lg rounded-full"}
                    alt=""
                  />
                  <div className="grid grid-rows-2 ml-4">
                    <div className="flex gap-1">
                      <h6 className="font-bold">@tagname</h6>
                      <p>comment</p>
                    </div>
                    <div className="flex gap-3 items-end">
                      <small className="text-gray-400">6d</small>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          15 likes
                        </small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">Reply</small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          See translation
                        </small>
                      </Link>
                      <Link href={"#"} className="opacity-75 hover:opacity-100">
                        <small>
                          <i class="fas fa-ellipsis-h"></i>
                        </small>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={"flex items-center"}>
                  <Image
                    src={avatar}
                    className={"size-10 text-lg rounded-full"}
                    alt=""
                  />
                  <div className="grid grid-rows-2 ml-4">
                    <div className="flex gap-1">
                      <h6 className="font-bold">@tagname</h6>
                      <p>comment</p>
                    </div>
                    <div className="flex gap-3 items-end">
                      <small className="text-gray-400">6d</small>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          15 likes
                        </small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">Reply</small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          See translation
                        </small>
                      </Link>
                      <Link href={"#"} className="opacity-75 hover:opacity-100">
                        <small>
                          <i class="fas fa-ellipsis-h"></i>
                        </small>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={"flex items-center"}>
                  <Image
                    src={avatar}
                    className={"size-10 text-lg rounded-full"}
                    alt=""
                  />
                  <div className="grid grid-rows-2 ml-4">
                    <div className="flex gap-1">
                      <h6 className="font-bold">@tagname</h6>
                      <p>comment</p>
                    </div>
                    <div className="flex gap-3 items-end">
                      <small className="text-gray-400">6d</small>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          15 likes
                        </small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">Reply</small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          See translation
                        </small>
                      </Link>
                      <Link href={"#"} className="opacity-75 hover:opacity-100">
                        <small>
                          <i class="fas fa-ellipsis-h"></i>
                        </small>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={"flex items-center"}>
                  <Image
                    src={avatar}
                    className={"size-10 text-lg rounded-full"}
                    alt=""
                  />
                  <div className="grid grid-rows-2 ml-4">
                    <div className="flex gap-1">
                      <h6 className="font-bold">@tagname</h6>
                      <p>comment</p>
                    </div>
                    <div className="flex gap-3 items-end">
                      <small className="text-gray-400">6d</small>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          15 likes
                        </small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">Reply</small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          See translation
                        </small>
                      </Link>
                      <Link href={"#"} className="opacity-75 hover:opacity-100">
                        <small>
                          <i class="fas fa-ellipsis-h"></i>
                        </small>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={"flex items-center"}>
                  <Image
                    src={avatar}
                    className={"size-10 text-lg rounded-full"}
                    alt=""
                  />
                  <div className="grid grid-rows-2 ml-4">
                    <div className="flex gap-1">
                      <h6 className="font-bold">@tagname</h6>
                      <p>comment</p>
                    </div>
                    <div className="flex gap-3 items-end">
                      <small className="text-gray-400">6d</small>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          15 likes
                        </small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">Reply</small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          See translation
                        </small>
                      </Link>
                      <Link href={"#"} className="opacity-75 hover:opacity-100">
                        <small>
                          <i class="fas fa-ellipsis-h"></i>
                        </small>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={"flex items-center"}>
                  <Image
                    src={avatar}
                    className={"size-10 text-lg rounded-full"}
                    alt=""
                  />
                  <div className="grid grid-rows-2 ml-4">
                    <div className="flex gap-1">
                      <h6 className="font-bold">@tagname</h6>
                      <p>comment</p>
                    </div>
                    <div className="flex gap-3 items-end">
                      <small className="text-gray-400">6d</small>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          15 likes
                        </small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">Reply</small>
                      </Link>
                      <Link href={"#"}>
                        <small className="font-bold text-gray-400">
                          See translation
                        </small>
                      </Link>
                      <Link href={"#"} className="opacity-75 hover:opacity-100">
                        <small>
                          <i class="fas fa-ellipsis-h"></i>
                        </small>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={"h-[98px] pt-1 pb-3 px-2 border-t border-l"}
                alt="actionBox"
              >
                <div className="flex justify-between">
                  <div className="flex gap-1">
                    <HeartButton className="!text-[22px] p-1" />
                    <CommentButton className="!text-[22px] p-1" />
                    <ShareButton className="!text-[22px] p-1" />
                  </div>
                  <BookmarkButton className="!text-[22px] p-1" />
                </div>
                <div className="pl-2 flex flex-col">
                  <strong>1000 likes</strong>
                  <small className="text-gray-400">2 days ago</small>
                </div>
              </div>
              <div className={"h-[56px] border-t border-l pt-1 px-3"}>
                <CommentBox />

              </div>
            </div>
          </div>
          <button
            onClick={toggleModal}
            className="absolute top-3 right-3 text-4xl text-gray-200 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}
