"use client";

import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/solid";
import ModalDialog from "@/components/global/ModalDialog";
import { useModal } from "@/components/provider/ModalProvider";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Select, SelectItem, Textarea, Spinner } from "@heroui/react";
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
  if (!user) return null;
  
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-neutral-700 overflow-hidden">
        <Image
          src={user.avatar?.url || "/images/default-avatar.png"}
          alt="Avatar"
          width={40}
          height={40}
          className="object-cover w-full h-full"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">@{user?.username}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">{user?.firstName} {user?.lastName}</p>
      </div>
    </div>
  );
};

const MediaPreview = ({ file, onRemove }) => {
  const isVideo = file.type.startsWith("video/");

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getUser();
        setUser(currentUser);
      } catch (error) {
        addToast({
          title: "Error loading user data",
          description: "Please refresh the page or try again later.",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "danger",
        });
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    return () => {
      previews.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [previews]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxFiles = 12;
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "video/mp4",
      "video/webm",
    ];

    // Check file count
    if (files.length + selectedFiles.length > maxFiles) {
      addToast({
        title: "Too many files",
        description: `You can only upload up to ${maxFiles} files.`,
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "warning",
      });
      return;
    }

    // Validate files
    const validFiles = selectedFiles.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        addToast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type.`,
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "warning",
        });
        return false;
      }

      if (file.size > maxFileSize) {
        addToast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB size limit.`,
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "warning",
        });
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    const newPreviews = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      addToast({
        title: "No files selected",
        description: "Please select at least one media file to upload.",
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "warning",
      });
      return null;
    }

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("/lib/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      return data;
    } catch (error) {
      addToast({
        title: "Upload failed",
        description: "Failed to upload media files. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "danger",
      });
      return null;
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (files.length === 0) {
        addToast({
          title: "No files selected",
          description: "Please select at least one media file to upload.",
          timeout: 3000,
          shouldShowTimeoutProgess: true,
          color: "warning",
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
      if (!post) throw new Error("Failed to save post");

      // Handle hashtags
      const hashtagList = caption
        .toString()
        .split(/(\#[a-zA-Z0-9_]+)/g)
        .filter((word) => word.startsWith("#"));

      if (hashtagList.length > 0) {
        const newHashtags = hashtagList.map((h) => ({ content: h }));
        const savedHashtags = await insertHashtags(newHashtags);
        
        if (savedHashtags) {
          const hashtagDetails = savedHashtags.map((h) => ({
            hashtag: h,
            post: post,
          }));

          await insertHashtagDetails(hashtagDetails);
        }
      }

      // Handle media upload
      const uploadedFiles = await handleUpload();
      if (!uploadedFiles?.files?.length) throw new Error("Failed to upload media");

      const postMedia = uploadedFiles.files.map((file) => ({
        post: post,
        url: file.url,
        fileType: file.file_type,
        size: file.size,
        mediaType: file.media_type.toUpperCase(),
      }));

      const savedMedia = await saveMedia(post?.id, postMedia);
      if (!savedMedia) throw new Error("Failed to save media");

      addToast({
        title: "Success",
        description: "Your post has been published successfully!",
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "success",
      });

      refreshPost();
    } catch (error) {
      addToast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        timeout: 3000,
        shouldShowTimeoutProgess: true,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshPost = () => {
    setFiles([]);
    setPreviews([]);
    setCaption("");
    setIsCommentVisible(false);
    setIsLikeVisible(false);
    setAudience("PUBLIC");
  };

  const removeFile = (file) => {
    setPreviews((prev) => prev.filter((item) => item.url !== file.url));
    setFiles((prev) => prev.filter((item) => item.url !== file.url));
  };

  return (
    <>
      <ToastProvider placement="top-right" />
      <div className="h-screen bg-gray-50 dark:bg-neutral-900 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create New Post</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share your moments with the world
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
                title="Discard this post?"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  If you leave now, your changes will be lost. Are you sure you want to discard this post?
                </p>
              </ModalDialog>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading || files.length === 0}
                className={cn(
                  "px-4 py-2 text-sm font-medium text-white rounded-lg",
                  "bg-indigo-600 hover:bg-indigo-700",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-colors duration-200"
                )}
              >
                {loading ? "Creating..." : "Create Post"}
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
                label="Creating your post..."
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
                  />
                  <PostSwitch
                    onToggle={setIsCommentVisible}
                    title="Turn off commenting"
                    subtitle="Disable comments to control interactions on your post"
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
