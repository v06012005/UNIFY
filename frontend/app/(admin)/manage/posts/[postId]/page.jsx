"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import avatar from "@/public/images/testreel.jpg";
import avatar2 from "@/public/images/testAvt.jpg";
import Link from "next/link";
import { fetchPostById, updateReport } from "@/app/lib/dal";
import { useParams, useRouter } from "next/navigation";
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
  addToast,
  Spinner,
  Input,
} from "@heroui/react";
import Cookies from "js-cookie";
import { cn } from "@/app/lib/utils";
import clsx from "clsx";
import ReportedPostLoading from "./loading";

const MyHeading2 = ({ content = "Heading 2" }) => {
  return <h2 className="font-bold text-2xl my-4">{content}</h2>;
};

const PostDetail = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [report, setReport] = useState(null);
  const { postId } = useParams();
  const [isButtonLoading, setButtonLoading] = useState(false);
  const [actionReason, setActionReason] = useState("");
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const router = useRouter();

  const {
    isOpen: isConfirmOpen,
    onOpen: onOpenConfirm,
    onOpenChange: onConfirmOpenChange,
  } = useDisclosure();

  const handleApprove = async () => {
    if (!actionReason.trim()) {
      return;
    }
    try {
      setButtonLoading(true);
      const data = await updateReport(report?.id, 1, actionReason);
      setReport(data);
      setActionReason("");
    } catch (error) {
      addToast({
        title: "Fail",
        description:
          "Encounter an error. Cannot process this report.",
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "danger",
      });
    }
    finally {
      setButtonLoading(false);
    }
  }

  const handleReject = async () => {
    if (!actionReason.trim()) {
      return;
    }
    try {
      setButtonLoading(true);
      const data = await updateReport(report?.id, 2, actionReason);
      setReport(data);
      setActionReason("");
    } catch (error) {
      addToast({
        title: "Fail",
        description:
          "Encounter an error. Cannot process this report.",
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "danger",
      });
    }
    finally {
      setButtonLoading(false);
    }
  }

  useEffect(() => {
    async function getReportedPost() {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const response = await fetch(
          `http://localhost:8080/reports/${postId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Encounterd an error.");
        }
        const data = await response.json();
        if (data.length === 0) {
          console.warn("Cannot fetch the reported post.");
        }
        // const reporter = await fetchPostById(data.reportedId);
        setReport(data);
        setPost(data.reportedEntity);
      } catch (error) {
        alert(`An error has occured: ${postId}`);
      } finally {
        setLoading(false);
      }
    }
    getReportedPost();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reported Post Details
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Show all the details about the reported post.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="bordered"
              startContent={<i className="fa-solid fa-arrow-left"></i>}
              onPress={() => router.back()}
              className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
            >
              Return to List
            </Button>
            {report?.status === 0 && (
              <div className="flex gap-3">
                <Button
                  color="success"
                  startContent={<i className="fa-solid fa-thumbs-up"></i>}
                  onPress={() => {
                    setActionType('approve');
                    onOpenConfirm();
                  }}
                  isLoading={isButtonLoading}
                >
                  Approve
                </Button>
                <Button
                  color="danger"
                  startContent={<i className="fa-solid fa-ban"></i>}
                  onPress={() => {
                    setActionType('reject');
                    onOpenConfirm();
                  }}
                  isLoading={isButtonLoading}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <ReportedPostLoading />
        ) : (
          <div className="space-y-6">
            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Basic Info</h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Report ID</p>
                      <p className="mt-1">{report?.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reported Date</p>
                      <p className="mt-1">
                        {new Date(report?.reportedAt).toLocaleString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                      <span
                        className={clsx("mt-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium", {
                          "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300": report?.status === 0,
                          "bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300": report?.status === 1,
                          "bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300": report?.status === 2,
                          "bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300": report?.status === 3,
                          "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300": report?.status === 4,
                        })}
                      >
                        {report?.status === 0
                          ? "Pending"
                          : report?.status === 1
                          ? "Approved"
                          : report?.status === 2
                          ? "Rejected"
                          : report?.status === 3
                          ? "Resolved"
                          : "Canceled"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reporter's ID</p>
                      <p className="mt-1">{report?.userId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reported Post's ID</p>
                      <p className="mt-1">{report?.reportedId}</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reported Post Owner</h2>
              </CardHeader>
              <CardBody>
                <User
                  avatarProps={{
                    src: post?.user?.avatar?.url,
                    className: "w-12 h-12",
                  }}
                  description={post?.user?.email}
                  name={`${post?.user?.firstName} ${post?.user?.lastName}`}
                  className="gap-3"
                />
              </CardBody>
            </Card>

            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reported Reason</h2>
              </CardHeader>
              <CardBody>
                <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300">{report?.reason}</p>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Post Details</h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div
                      className="border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-lg p-4 cursor-pointer hover:border-gray-400 dark:hover:border-neutral-600 transition-colors"
                      onClick={onOpen}
                    >
                      <div className="flex flex-col items-center justify-center h-32">
                        <i className="fa-solid fa-photo-film text-3xl text-gray-400 mb-2"></i>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Click to view media</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-4">
                      {post?.captions ? (
                        <p className="text-gray-700 dark:text-gray-300">{post.captions}</p>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">This post contains no captions.</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        <Modal isOpen={isOpen} size="5xl" onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold">Post Media</h2>
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {post?.media?.map((file) => {
                      const isVideo = file.mediaType.includes("VIDEO");
                      return (
                        <div key={file.url} className="relative aspect-square">
                          {isVideo ? (
                            <video
                              src={file.url}
                              controls
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Image
                              src={file.url}
                              alt="Preview"
                              fill
                              className="object-cover rounded-lg"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal isOpen={isConfirmOpen} onOpenChange={onConfirmOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <h2 className="text-xl font-bold">
                    {actionType === 'approve' ? "Approve Report" : "Reject Report"}
                  </h2>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      Please provide a reason for {actionType === 'approve' ? 'approving' : 'rejecting'} this report. This information will be recorded.
                    </p>
                    <Input
                      label={`${actionType === 'approve' ? 'Approval' : 'Rejection'} Reason`}
                      placeholder={`Enter your reason for ${actionType === 'approve' ? 'approval' : 'rejection'}`}
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      isRequired
                      errorMessage={!actionReason.trim() && "Reason is required"}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color={actionType === 'approve' ? "success" : "danger"}
                    onPress={() => {
                      if (actionReason.trim()) {
                        if (actionType === 'approve') {
                          handleApprove();
                        } else {
                          handleReject();
                        }
                        onClose();
                      }
                    }}
                    isDisabled={!actionReason.trim()}
                  >
                    {actionType === 'approve' ? 'Approve' : 'Reject'}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default PostDetail;
