"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import avatar from "@/public/images/testreel.jpg";
import avatar2 from "@/public/images/testAvt.jpg";
import Link from "next/link";
import { fetchPostById } from "@/app/lib/dal";
import { useParams } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

const Caption = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="leading-snug text-wrap">
      {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      <button
        onClick={toggleExpanded}
        className="text-blue-500 font-semibold ml-2 hover:underline"
      >
        {isExpanded ? "Less" : "More"}
      </button>
    </div>
  );
};

const Hashtag = ({ content = "", to = "" }) => {
  return (
    <Link
      href={to}
      className="text-lg text-sky-500 mr-4 hover:underline hover:decoration-sky-500"
    >
      {content}
    </Link>
  );
};

const PostDetail = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [post, setPost] = useState(null);
  const { postId } = useParams();

  useEffect(() => {
    async function getPost() {

      console.log(postId)
      const post = await fetchPostById(postId);
      setPost(post);
      // setLoading(false);
    }
    getPost();
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen  p-6">
      <h1 className="font-bold text-3xl mb-8">Post Detail</h1>

      <div className="w-full max-w-4xl  ">
        <div className="flex items-center mb-4">
          <Image src={avatar} alt="Avatar" className="w-12 h-12 rounded-full" />
          <div className="ml-4">
            <span className="block font-bold text-lg">{post?.user?.username}</span>
            <span className="text-sm text-gray-400">• 5h</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 mb-6 md:mb-0 md:mr-6">
            <div className="border rounded-md flex h-full cursor-pointer select-none" onClick={onOpen}>
              <i className="fa-solid fa-photo-film fa-2xl m-auto"> Media</i>
            </div>
            {/* <Image
              src={avatar2}
              alt="Main display"
              className="rounded-lg shadow-lg w-full"
            /> */}
          </div>

          <div className="w-full md:w-1/2">
            <Caption
              text={post?.captions ? post?.captions : ""}
            />
            <div className="mt-2 flex flex-wrap">
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
              <Hashtag content="#myhashtag"></Hashtag>
            </div>
            <div className=" dark:text-white text-3xl flex mt-4">
              <div className="flex flex-col items-cente ">
                <i className="fa-solid fa-heart   focus:opacity-50 transition cursor-pointer text-red-500"></i>
                <span className="text-sm">47k</span>
              </div>

              <div className="flex flex-col items-center ml-4">
                <i className="fa-regular fa-comment hover:opacity-50 focus:opacity-50 transition cursor-pointer"></i>
                <span className="text-sm">47k</span>
              </div>

              <div className="flex flex-col items-center ml-4">
                <i className="fa-regular fa-paper-plane hover:opacity-50 focus:opacity-50 transition"></i>
                <span className="text-sm">47k</span>
              </div>
            </div>
            <div className="flex justify-end  ">
              <button className="px-6 py-3 bg-red-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition duration-300 ease-in-out flex items-center">
                <i className="fas fa-trash-alt mr-2"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} size="5xl" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Post Media</ModalHeader>
              <ModalBody className="mt-4 grid grid-cols-4 gap-2 items-stretch">
                {post?.media?.map((file) => {
                  const isVideo = file.mediaType.includes("VIDEO");

                  return (
                    <div key={file.url} className="relative w-full h-full">
                      {isVideo ? (
                        <video
                          src={file.url}
                          controls
                          className="w-full aspect-square h-full object-cover rounded-md border"
                        />
                      ) : (
                        <Image
                          src={file.url}
                          alt="Preview"
                          width={100}
                          height={100}
                          className="w-full aspect-square h-full object-cover rounded-md border"
                        />
                      )}
                    </div>
                  );
                })}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {/* <Button color="primary" onPress={onClose}>
                  Action
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PostDetail;
