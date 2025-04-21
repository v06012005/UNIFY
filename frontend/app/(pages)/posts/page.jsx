"use client";

import avatar from "@/public/images/test1.png";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/solid";
import ModalDialog from "@/components/global/ModalDialog";
import { useModal } from "@/components/provider/ModalProvider";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Select, SelectItem, Textarea } from "@heroui/react";
import PostSwitch from "@/components/global/PostSwitch";
import { useEffect, useRef, useState } from "react";
import {
  getUser,
  insertHashtagDetails,
  insertHashtags,
  saveMedia,
  savePost,
} from "@/app/lib/dal";
import { cn } from "@/app/lib/utils";
import { addToast, ToastProvider } from "@heroui/toast";

const User = ({ user }) => {
  return (
    <div className="flex w-full items-center">
      {user?.avatar?.url && (
        <div className="w-14 h-14 rounded-full border-2 border-gray-300 overflow-hidden">
          <Image
            src={user.avatar.url}
            alt="Avatar"
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="ml-5">
        <p className="text-lg font-bold">{user?.username}</p>
        <p>{user?.firstName + " " + user?.lastName}</p>
      </div>
    </div>
  );
};

const Page = () => {
  const { openModal } = useModal();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isLikeVisible, setIsLikeVisible] = useState(false);
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [audience, setAudience] = useState("PUBLIC");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [hashtags, setHashtags] = useState([]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getUser();
      setUser(currentUser);
    }

    fetchUser();
  }, []);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleAudienceChange = (keys) => {
    const selectedValue = Array.from(keys)[0];
    setAudience(selectedValue);
  };

  const handleLikeVisibility = (newValue) => {
    setIsLikeVisible(newValue);
  };

  const handleCommentVisibility = (newValue) => {
    setIsCommentVisible(newValue);
  };

  function handleClick() {
    refreshPost();
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "video/mp4",
      "video/webm",
    ];
    const validFiles = selectedFiles.filter((file) =>
      allowedTypes.includes(file.type)
    );

    if (validFiles.length === 0) {
      alert(
        "Only images (png, jpeg, jpg, gif) and videos (mp4, webm) are allowed."
      );
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    const newPreviews = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  useEffect(() => {
    return () => {
      previews.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [previews]);

  const handleUpload = async () => {
    if (files.length === 0)
      return addToast({
        title: "No files uploaded",
        description: "Please upload at least one media file (image/ video).",
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "warning",
      });

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = await fetch("/lib/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data;
  };

  const refreshPost = () => {
    setFiles([]);
    setPreviews([]);
    setCaption("");
    setIsCommentVisible(false);
    setIsLikeVisible(false);
    setAudience("PUBLIC");
    setHashtags([]);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (files.length === 0) {
        addToast({
          title: "No files uploaded",
          description: "Please upload at least one media file (image/ video).",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "danger",
        });
        return;
      }

      const newPost = {
        captions: caption,
        audience: audience,
        user: user,
        isCommentVisible: isCommentVisible,
        isLikeVisible: isLikeVisible,
        postedAt: new Date().toISOString(),
      };

      const post = await savePost(newPost);
      if (!post) {
        addToast({
          title: "Fail to save post",
          description:
            "Cannot save your post. Please contact the admin for further information",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "danger",
        });
        return;
      }

      const hashtagList = caption
        .toString()
        .split(/(\#[a-zA-Z0-9_]+)/g)
        .filter((word) => word.startsWith("#"));
      if (hashtagList.length > 0) {
        const newHashtags = hashtagList.map((h) => ({
          content: h,
        }));
        const savedHashtags = await insertHashtags(newHashtags);
        if (!savedHashtags) {
          addToast({
            title: "Fail to proceed hashtags",
            description:
              "Cannot proceed your hashtags. Please contact the admin for further information or try again",
            timeout: 3000,
            shouldShowTimeoutProgess: true,
            color: "danger",
          });
          return;
        }

        const hashtagDetails = savedHashtags.map((h) => ({
          hashtag: h,
          post: post,
        }));

        if (hashtagDetails.length > 0) {
          const savedDetails = await insertHashtagDetails(hashtagDetails);
          if (!savedDetails) {
            addToast({
              title: "Fail to proceed hashtags.",
              description:
                "Cannot proceed your hashtags. Please contact the admin for further information or try again.",
              timeout: 3000,
              shouldShowTimeoutProgess: true,
              color: "danger",
            });
            return;
          }
        }
      }

      const fetchedFiles = await handleUpload();
      if (!fetchedFiles || fetchedFiles.length === 0) {
        addToast({
          title: "No files uploaded",
          description: "Please upload at least one media file (image/ video).",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "danger",
        });
        return;
      }

      const postMedia = fetchedFiles.files.map((file) => ({
        post: post,
        url: file.url,
        fileType: file.file_type,
        size: file.size,
        mediaType: file.media_type.toUpperCase(),
      }));

      const savedMedia = await saveMedia(post?.id, postMedia);
      if (savedMedia) {
        addToast({
          title: "Success",
          description:
            "Your post is uploaded successfully. Other users can now interact with your post.",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "success",
        });
        refreshPost();
      } else {
        addToast({
          title: "Fail to save media",
          description:
            "The server ran into a problem and could not save your images/ videos successfully. Please contact the admin for further information.",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Encountered an error",
        description: "Error: " + error,
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (value) => {
    setPreviews((prevPreviews) =>
      prevPreviews.filter((item) => item.url !== value.url)
    );
    setFiles((prevFiles) => prevFiles.filter((item) => item.url !== value.url));
  };

  return (
    <>
      <ToastProvider placement={"top-right"} />
      <div className="h-screen">
        <div className="flex flex-col h-full px-4">
          <div className="grid grid-cols-2">
            <h1 className="font-bold text-4xl border rounded-md w-fit p-2 my-4 mx-3 bg-black text-white dark:text-black dark:bg-white">
              POST
            </h1>
            <User user={user} />
          </div>
          {loading && (
            <div className="fixed inset-0 bg-transparent z-[9998]"></div>
          )}

          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9998]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
            </div>
          )}

          <div className="flex h-full border-t-1 dark:border-neutral-700">
            <div className="basis-1/2 p-3">
              <div className="h-full">
                <div className="flex justify-between">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                  >
                    Photos or/and videos
                  </label>
                  {/* <button onClick={handleDivClick} className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500"><i className="fa-solid fa-arrow-up-from-bracket"></i></button> */}
                </div>
                {/* {images.length > 0 && ( */}
                <div
                  className={cn(
                    previews.length > 0 &&
                      "mt-4 grid grid-cols-4 gap-2 items-stretch",
                    previews.length < 1 && "h-full"
                  )}
                >
                  {previews.map((file) => {
                    const isVideo = file.type.startsWith("video/");

                    return (
                      <div key={file.url} className="relative w-full h-full">
                        <button
                          onClick={() => removeFile(file)}
                          className="z-50 absolute right-[-5px] top-[-5px] bg-red-500 text-white rounded-full h-4 w-4 flex"
                        >
                          <i className="fa-solid m-auto fa-sm fa-xmark"></i>
                        </button>
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
                  <div
                    onClick={handleDivClick}
                    className={cn(
                      "mt-2 cursor-pointer flex justify-center rounded-lg border border-dashed  dark:border-neutral-500 border-gray-900/25",
                      previews.length < 1 && "h-5/6 px-6 py-10",
                      previews.length > 0 && "h-full my-auto",
                      previews.length >= 12 && "hidden"
                    )}
                  >
                    <div className="text-center my-auto">
                      <PhotoIcon
                        aria-hidden="true"
                        className="mx-auto size-12 text-gray-300 dark:text-white"
                      />
                      <div className="mt-4 flex text-sm/6 text-gray-600 dark:text-white">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white dark:bg-black font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          <span>Upload photos or/and videos here</span>
                        </label>
                      </div>
                      <p className="text-xs/5 text-gray-600 dark:text-gray-100">
                        PHOTOS AND VIDEOS
                      </p>
                    </div>
                  </div>
                </div>
                {/* )} */}

                <input
                  ref={fileInputRef}
                  id="file-upload"
                  multiple
                  name="file-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/gif, video/mp4, video/webm"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </div>
              <p>{hashtags}</p>
            </div>
            <div className="basis-1/2 border-l-1 dark:border-neutral-700 p-3 overflow-y-scroll no-scrollbar">
              <div>
                <p className="text-sm/6 font-medium text-gray-900 dark:text-white">
                  Write Your Caption
                </p>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write your caption here"
                  minRows={9}
                  variant="underlined"
                />
              </div>
              <div>
                <p className="text-sm/6 mt-3 font-medium text-gray-900 mb-2 dark:text-white">
                  Who can see your post?
                </p>
                <Select
                  onSelectionChange={handleAudienceChange}
                  defaultSelectedKeys={["PUBLIC"]}
                  className="w-full"
                  label=""
                  variant="underlined"
                  selectedKeys={[audience]}
                >
                  <SelectItem
                    key={"PUBLIC"}
                    startContent={<i className="fa-solid fa-earth-asia"></i>}
                  >
                    Public
                  </SelectItem>
                  <SelectItem
                    key={"PRIVATE"}
                    startContent={<i className="fa-solid fa-lock"></i>}
                  >
                    Private
                  </SelectItem>
                </Select>
              </div>
              <div>
                <p className="text-sm/6 font-medium text-gray-900 my-2 dark:text-white">
                  Advanced Settings
                </p>
                <div>
                  <PostSwitch
                    onToggle={handleLikeVisibility}
                    className="mb-3"
                    title={"Hide like and comment counts on this post"}
                    subtitle="Control your privacy by hiding the like and comment counts on this post, keeping the focus on the content rather than the numbers."
                  />
                  <PostSwitch
                    onToggle={handleCommentVisibility}
                    title={"Turn off commenting"}
                    subtitle="Disable comments on this post to maintain control over interactions and focus solely on the content."
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  onClick={openModal}
                  className="text-sm/6 font-semibold text-gray-900 dark:text-white"
                >
                  Cancel
                </button>
                <ModalDialog
                  icon={
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                  }
                  buttonText="Discard"
                  handleClick={handleClick}
                  title={"Discard this post"}
                >
                  <p className="mt-4 text-sm text-gray-600">
                    If you leave, your edits will be deleted. Are you sure that
                    you want to discard this post?
                  </p>
                </ModalDialog>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
