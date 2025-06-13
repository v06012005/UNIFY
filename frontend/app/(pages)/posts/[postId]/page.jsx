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
import { fetchPostById, getUser, insertHashtagDetails, insertHashtags, saveMedia, savePost, updatePost } from "@/app/lib/dal";
import { cn } from "@/app/lib/utils";
import { addToast, ToastProvider } from "@heroui/toast";
import { redirect, useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Spinner } from "@heroui/react";

const MediaPreview = ({ file, onRemove }) => {
  const isVideo = file.type?.startsWith("video/") || file.mediaType === 'VIDEO';

  return (
    <div className="relative group">
      <button
        onClick={() => onRemove(file)}
        className="absolute -right-2 -top-2 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
      >
        <i className="fa-solid fa-xmark text-sm"></i>
      </button>
      {isVideo ? (
        <video
          src={file.url}
          controls
          className="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-neutral-700"
        />
      ) : (
        <Image
          src={file.url}
          alt="Preview"
          width={200}
          height={200}
          className="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-neutral-700"
        />
      )}
    </div>
  );
};

const User = ({ user }) => {
  return (
    <div className="flex mb-4 w-full my-auto">
      <Image src={ avatar } alt="Avatar" className="rounded-full w-14 h-14" />
      <div className="ml-5">
        <p className="my-auto text-lg font-bold">{user?.username}</p>
        <p className="my-auto">{user?.firstName + " " + user?.lastName}</p>
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
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const [existingFiles, setExistingFiles] = useState([]);

  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getUser();
      setUser(currentUser);
    }

    async function fetchPost() {
      const fetchedPost = await fetchPostById(postId);
      setPost(fetchedPost);
      setPreviews(fetchedPost?.media);
      setCaption(fetchedPost?.captions)
      setAudience(fetchedPost?.audience)
      setIsCommentVisible(fetchedPost?.isCommentVisible)
      setIsLikeVisible(fetchedPost?.isLikeVisible)
      setLoading(false);
      const eFiles = fetchedPost?.media.map(m => ({
        url: m.url,
        file_type: m.fileType,
        size: m.size,
        media_type: m.mediaType
      }))
      setExistingFiles([...eFiles]);
    }

    fetchUser();
    fetchPost();



  }, []);

  useEffect(() => {
    handleCommentVisibility(isCommentVisible);
    handleLikeVisibility(isLikeVisible);
  }, [isCommentVisible, isLikeVisible])

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
    redirect(`/profile/${user.username}`);
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

    if (files.length === 0 && existingFiles.length === 0) {
      addToast({
        title: "No files uploaded",
        description: "Please upload at least one media file (image/video).",
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "warning",
      });
      return;
    }

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
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validate media
      if (files.length === 0 && existingFiles.length === 0) {
        addToast({
          title: "No files uploaded",
          description: "Please upload at least one media file (image/video).",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "warning",
        });
        return;
      }

      // Process hashtags first
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
      let savedMedia = [];
      if (fetchedFiles.length !== 0) {
        const newMedia = fetchedFiles?.files?.map(file => ({
          post: post,
          url: file.url,
          fileType: file.file_type,
          size: file.size,
          mediaType: file.media_type.toUpperCase(),
        }));

        savedMedia = await saveMedia(post.id, newMedia);
      }

      const finalMedia = [...savedMedia, ...existingFiles];
      console.log(finalMedia)
      const newPost = {
        ...post,
        captions: caption,
        audience: audience,
        isCommentVisible: isCommentVisible,
        isLikeVisible: isLikeVisible,
        media: finalMedia
      };

      const updatedPost = await updatePost(newPost);
      if (!updatedPost) {
        addToast({
          title: "Fail to save post",
          description:
            "Cannot save your post. Please contact the admin for further information",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "danger",
        });
        return;
      } else {
        addToast({
          title: "Success",
          description: "Your post is updated successfully. Other users can now interact with your post.",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "success",
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
    setExistingFiles((prevFiles) => prevFiles.filter((item) => item.url !== value.url));
  };

  useEffect(() => {
    console.log("Updated existingFiles:", existingFiles);
  }, [existingFiles]);

  return (
    <>
      <ToastProvider placement="top-right" />
      <div className="h-screen bg-gray-50 dark:bg-neutral-900 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Post</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Update your post details
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={openModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Cancel
              </button>
              <ModalDialog
                icon={<ExclamationTriangleIcon className="w-6 h-6 text-red-500" />}
                buttonText="Discard"
                handleClick={refreshPost}
                title="Discard changes?"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  If you leave now, your changes will be lost. Are you sure you want to discard editing this post?
                </p>
              </ModalDialog>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading || (files.length === 0 && existingFiles.length === 0)}
                className={cn(
                  "px-4 py-2 text-sm font-medium text-white rounded-lg",
                  "bg-indigo-600 hover:bg-indigo-700",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-colors duration-200"
                )}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {loading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <Spinner
                classNames={{
                  label: "text-white mt-4 font-medium",
                  base: "text-white"
                }}
                label="Saving your post..."
                variant="wave"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
            {/* Media Upload Section */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Media</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload photos or videos to share
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-neutral-700 px-3 py-1 rounded-full">
                  {previews.length}/12 files
                </span>
              </div>

              <div className={cn(
                "grid gap-4",
                previews.length > 0 ? "grid-cols-2 sm:grid-cols-3" : "h-[calc(100%-4rem)]"
              )}>
                {previews.map((file) => (
                  <MediaPreview
                    key={file.url}
                    file={file}
                    onRemove={removeFile}
                  />
                ))}

                {previews.length < 12 && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors",
                      "border-gray-300 dark:border-neutral-600",
                      "hover:border-gray-400 dark:hover:border-neutral-500",
                      "hover:bg-gray-50 dark:hover:bg-neutral-700/50",
                      previews.length === 0 ? "h-full" : "aspect-square"
                    )}
                  >
                    <PhotoIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Click to upload
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png, image/jpeg, image/gif, video/mp4, video/webm"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Post Details Section */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-neutral-700">
                  <User user={user} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Caption
                  </label>
                  <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write your caption here..."
                    minRows={4}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Audience
                  </label>
                  <Select
                    selectedKeys={[audience]}
                    onSelectionChange={(keys) => setAudience(Array.from(keys)[0])}
                    className="w-full"
                  >
                    <SelectItem
                      key="PUBLIC"
                      startContent={<i className="fa-solid fa-earth-asia"></i>}
                    >
                      Public
                    </SelectItem>
                    <SelectItem
                      key="PRIVATE"
                      startContent={<i className="fa-solid fa-lock"></i>}
                    >
                      Private
                    </SelectItem>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Advanced Settings
                  </h3>
                  <PostSwitch
                    onToggle={setIsLikeVisible}
                    title="Hide like and comment counts"
                    subtitle="Keep the focus on your content by hiding engagement metrics"
                    isOn={isLikeVisible}
                  />
                  <PostSwitch
                    onToggle={setIsCommentVisible}
                    title="Turn off commenting"
                    subtitle="Disable comments to control interactions on your post"
                    isOn={isCommentVisible}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
