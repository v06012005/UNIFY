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
  Card,
  CardHeader,
  CardBody,
  User,
} from "@heroui/react";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import ReportedPostLoading from "./loading";

const MyHeading2 = ({ content = "Heading 2" }) => {
  return (
    <h2 className="font-bold text-2xl my-4">{content}</h2>
  )
}

const PostDetail = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [report, setReport] = useState(null);
  const { postId } = useParams();

  useEffect(() => {
    async function getReportedPost() {
      try {
        setLoading(true)
        const token = Cookies.get("token");
        const response = await fetch(`http://localhost:8080/reports/${postId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Encounterd an error.");
        }
        const data = await response.json();
        if (data.length === 0) {
          console.warn("Cannot fetch the reported post.");
        };
        // const reporter = await fetchPostById(data.reportedId);
        setReport(data);
        setPost(data.reportedEntity);
      } catch (error) {
        alert(`An error has occured: ${postId}`)
      } finally {
        setLoading(false);
      }
    }
    getReportedPost();
  }, [])

  return (
    <div className="h-screen p-6">
      <div className="mb-4">
        <h1 className="font-bold text-3xl uppercase">Reported Post Details</h1>
        <p className="text-gray-500">Show all the details about the reported post.</p>
      </div>
      <div className="flex w-1/3">
        <button className="border rounded-md bg-green-500 font-bold text-white p-3"><i className="fa-solid fa-thumbs-up"></i> Approve</button>
        <button className="border rounded-md bg-red-500 font-bold ml-3 text-white p-3"><i className="fa-solid fa-circle-minus"></i> Deny</button>
      </div>
      {loading ? (<ReportedPostLoading />) : (
        <>
          <div className="border p-3 bg-gray-200 my-3 rounded-md">
            <MyHeading2 content="Basic Info" />
            <div className="w-3/4 pl-5">
              <ul>
                <li><p className="font-bold">Reported Date: <span className="font-normal">{new Date(report?.reportedAt).toLocaleString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}</span></p></li>
                <li>
                  <p className="font-bold">
                    Status: <span className={clsx("font-normal p-1 rounded italic", {
                      "bg-primary-200": report?.status === 0,
                      "bg-success-200": report?.status === 1,
                      "bg-red-200": report?.status === 2,
                      "bg-warning-200": report?.status === 3,
                      "bg-zinc-300": report?.status === 4
                    })}>
                      {report?.status === 0 ? "Pending" : report?.status === 1 ? "Approved" : report?.status === 2 ? "Rejected" : report?.status === 3 ? "Resolved" : "Canceled"}
                    </span>
                  </p>
                </li>
                <li><p className="font-bold">Reporter's ID: <span className="font-normal">{report?.userId}</span></p></li>
                <li><p className="font-bold">Reported Post's ID: <span className="font-normal">{report?.reportedId}</span></p></li>
              </ul>
            </div>
            <div className="flex w-3/4 pl-5 my-4 ">
              <Card className="py-2 shadow-none border rounded-md w-1/3">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <h4 className="font-bold text-large">Reporter</h4>
                </CardHeader>
                <CardBody className="overflow-visible">
                  <User
                    avatarProps={{
                      src: `${""}`,
                    }}
                    description={`mattle1@gmail.com`}
                    name={`Matt Le`} className="my-3 justify-start"
                  />
                </CardBody>
              </Card>
              <div className="flex mx-5">
                <i className="fa-regular my-auto fa-circle-right text-4xl"></i>
              </div>
              <Card className="py-2 shadow-none border rounded-md w-1/3">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <h4 className="font-bold text-large text-red-500">Reported Post Owner</h4>
                </CardHeader>
                <CardBody className="overflow-visible">
                  <User
                    avatarProps={{
                      src: `${post?.user?.avatar?.url}`,
                    }}
                    description={`${post?.user?.email}`}
                    name={`${post?.user?.firstName} ${post?.user?.lastName}`} className="my-3 justify-start"
                  />
                </CardBody>
              </Card>
            </div>
          </div>
          <div className="border p-3 bg-gray-200 my-3 rounded-md">
            <MyHeading2 content="Reported Reason" />
            <div className="w-full pl-5 max-h-52 overflow-y-auto mb-5">
              <p className="p-3 bg-white rounded-md">{report?.reason}</p>
            </div>
          </div>
          <div className="border p-3 bg-gray-200 my-3 rounded-md">
            <MyHeading2 content="Post Details" />
            <div className="w-full pb-5 pl-5">
              <div className="flex flex-col md:flex-row">
                <div className="w-1/3 md:w-1/2 mb-6 md:mb-0 md:mr-6">
                  <div className="border rounded-md flex h-32 cursor-pointer select-none bg-white" onClick={onOpen}>
                    <i className="fa-solid fa-photo-film fa-2xl m-auto"> Media</i>
                  </div>
                </div>

                <div className="w-full md:w-2/3 bg-white p-2 rounded-lg">
                  {post?.captions ? post.captions : (<p className="italic">This post contains no captions.</p>)}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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
