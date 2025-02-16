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
import { getUser } from "@/app/lib/dal";
import { cn } from "@/lib/utils";

const User = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getUser();
      setUser(currentUser);
    }

    fetchUser();
  })

  return (
    <div className="flex mb-4 w-full my-auto">
      <Image src={avatar} alt="Avatar" className="rounded-full w-14 h-14" />
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
  const [images, setImages] = useState([]);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  function handleClick() {
    alert("this is a function");
  }

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  return (
    <div className="h-screen">
      <div className="flex flex-col h-full px-4">
        <div className="grid grid-cols-2">
          <h1 className="font-bold text-4xl border rounded-md w-fit p-2 my-4 mx-3 bg-black text-white dark:text-black dark:bg-white">
            POST
          </h1>
          <User />
        </div>

        <div className="flex h-full border-t">
          <div className="basis-1/2 p-3">
            <div className="h-full">
              <div className="flex justify-between">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  Photos or/and videos
                </label>
                <button onClick={handleDivClick} className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500"><i className="fa-solid fa-arrow-up-from-bracket"></i></button>
              </div>
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative w-full h-full">
                      <Image
                        src={image.preview}
                        alt="Preview" width={100} height={100}
                        className="w-full h-full object-cover rounded-md border"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div onClick={handleDivClick} className={cn("mt-2 cursor-pointer flex justify-center rounded-lg border border-dashed dark:border-gray-200 border-gray-900/25",
                images.length < 1 && "h-5/6 px-6 py-10",
                images.length > 0 && "")}>
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

              <input
                ref={fileInputRef}
                id="file-upload"
                multiple
                name="file-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="basis-1/2 border-l p-3 overflow-y-scroll no-scrollbar">
            <div>
              <p className="text-sm/6 font-medium text-gray-900 dark:text-white">
                Write Your Caption
              </p>
              <Textarea
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
                defaultSelectedKeys={["public"]}
                className="w-full"
                label=""
                variant="underlined"
              >
                <SelectItem
                  key={"public"}
                  startContent={<i className="fa-solid fa-earth-asia"></i>}
                >
                  Public
                </SelectItem>
                <SelectItem
                  key={"private"}
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
                  className="mb-3"
                  title={"Hide like and comment counts on this post"}
                  subtitle="Control your privacy by hiding the like and comment counts on this post, keeping the focus on the content rather than the numbers."
                />
                <PostSwitch
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
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
