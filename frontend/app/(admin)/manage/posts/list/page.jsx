"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import avatar from "@/public/images/testreel.jpg";
import avatar2 from "@/public/images/testAvt.jpg";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { fetchPostList, fetchPostsByDate } from "@/app/lib/dal";
import { Autocomplete, AutocompleteItem, Spinner } from "@heroui/react";
import { DateRangePicker } from "@heroui/react";
import { Input as HeroInput } from "@heroui/react";
import { Button } from "@heroui/react";
import { cn } from "@/lib/utils";


const Caption = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="line-clamp-3">
      {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      <button
        onClick={toggleExpanded}
        className="text-gray-500 font-semibold ml-2"
      >
        {isExpanded ? "Less" : "More"}
      </button>
    </div>
  );
};


export const animals = [
  { label: "By date", key: "date", description: "Filtering all posts from a specific range.", startContent: <i className="fa-solid fa-calendar-days"></i> },
  { label: "By user", key: "user", description: "Fetching posts from a specific user.", startContent: <i className="fa-solid fa-user"></i> },
  // { label: "By audience", key: "audience", description: "See all posts with a specific audience type.", startContent: <i className="fa-solid fa-bullhorn"></i> }
];

const Postlist = () => {
  const [popupState, setPopupState] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePopup = (postId) => {
    setPopupState((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleDateChange = (date) => {
    const startDay = date.start?.day < 10 ? "0" + date.start?.day : date.start?.day;
    const endDay = date.end?.day < 10 ? "0" + date.end?.day : date.end?.day;
    const startMonth = date.start?.month < 10 ? "0" + date.start?.month : date.start?.month;
    const endMonth = date.end?.month < 10 ? "0" + date.end?.month : date.end?.month;

    const startDate = date.start?.year + "-" + startMonth + "-" + startDay;
    const endDate = date.end?.year + "-" + endMonth + "-" + endDay;
    setStart(startDate);
    setEnd(endDate);
    setLoading(true);
  }

  useEffect(() => {
    async function getPostList() {
      if (filter === "date" && start !== "" && end !== "" && start.length === 10 && end.length === 10) {
        const postlist = await fetchPostsByDate(start, end);
        setPosts(postlist);
        setLoading(false);
      } else {
        setPosts([]);
        setLoading(false);
      }
    }
    getPostList();


    if (end !== "" && start !== "" && start?.length === 10 && end?.length === 10 && !isEnabled) {
      setIsEnabled(true);
    } else {
      setIsEnabled(false)
    }
  }, [start, end, filter])

  // Tạo dữ liệu mẫu
  // const posts = Array.from({ length: 24 }, (_, index) => ({
  //   id: index + 1,
  //   avatar,
  //   name: `User${index + 1}`,
  //   time: `${index + 1}h`,
  //   image: avatar2,
  // }));

  // Tính toán vị trí bài viết dựa trên trang hiện tại
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);

  // Số trang
  const totalPages = Math.ceil(posts?.length / postsPerPage);

  return (
    <div className="m-4">
      <div className="w-full flex justify-around">
        <div className="m-3 flex">
          <h1 className="font-bold text-3xl pr-96">Post Manager</h1>
          <Input
            placeholder="Search..."
            className="w-[600px] h-12 dark:border-white font-bold"
          />
        </div>

      </div>
      <div className="ml-8 mt-4 flex">
        <Autocomplete onSelectionChange={(newVal) => { setFilter(newVal) }}
          allowsCustomValue
          className="max-w-xs"
          defaultItems={animals}
          label="Post filtering"
          labelPlacement="outside"
          placeholder="Select filtering criteria"
          variant="bordered"
        >
          {(item) => <AutocompleteItem startContent={item.startContent} key={item.key}>{item.label}</AutocompleteItem>}
        </Autocomplete>
        {filter === "date" && (
          <DateRangePicker onChange={(val) => handleDateChange(val)} labelPlacement="outside" className="max-w-xs ml-3" label="Date range" />
        )}
        {filter === "user" && (
          <HeroInput label="Email" type="email" variant="flat" labelPlacement="outside" placeholder="Enter user's email..." className="max-w-xs ml-3" />
        )}
      </div>
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <Spinner labelColor="primary" color="primary" label="Processing, please wait..." variant="simple" />
        </div>
      )}
      <div className="grid grid-cols-3 gap-6 p-10">
        {currentPosts?.map((post) => (
          <div key={post.id} className="p-4  ">
            <div className="flex items-center w-full mb-4 relative">
              <Image
                src={post.user?.avatar ? post.user.avatar : avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-3">
                <span className="font-bold text-base">{post.user.username}</span>
                <span className="text-sm text-gray-400">• {post.postedAt}</span>
              </div>
              <div className="absolute right-0">
                <i
                  className="fa-solid fa-ellipsis hover:opacity-50 focus:opacity-50 transition cursor-pointer"
                  onClick={() => togglePopup(post.id)}
                ></i>
                {popupState[post.id] && (
                  <div
                    id="overmore"
                    className="absolute right-0 top-full mt-2 w-44 backdrop-blur-xl p-2 rounded-lg shadow-lg text-white  "
                  >
                    <ul className="text-sm w">
                      <Link href={`${post.id}`}>
                        <li className="cursor-pointer  hover:bg-zinc-800  font-bold  text-left p-2 rounded-sm">
                          Show detail
                        </li>
                      </Link>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <Image
              src={post.media[0]?.url ? post.media[0].url : avatar2}
              alt="Main display"
              width={100}
              height={120}
              className="rounded-lg w-full shadow-lg object-cover"
            />
            <div className="mt-4">
              <Caption text={post.captions} />
            </div>
          </div>
        ))}
      </div>
      {/* {///////} */}
      <div className="flex justify-center items-center  ">
        {currentPosts?.length > 0 && (
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`px-4 py-2 mx-1 rounded-md ${currentPage === 1
              ? "border hover:cursor-not-allowed"
              : "dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white bg-black text-white hover:bg-white hover:text-black "
              }`}
            disabled={currentPage === 1}
          >
            <i className="fa fa-arrow-left"></i>
          </button>
        )}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 mx-1 rounded-md ${currentPage === index + 1
              ? "border hover:cursor-not-allowed"
              : "dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white bg-black text-white hover:bg-white hover:border hover:text-black "
              }`}
          >
            {index + 1}
          </button>
        ))}
        {currentPosts?.length > 0 && (
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className={`px-4 py-2 mx-1 rounded-md ${currentPage === totalPages
              ? "border hover:cursor-not-allowed"
              : "dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white bg-black text-white hover:bg-white hover:text-black "
              }`}
            disabled={currentPage === totalPages}
          >
            <i className="fa fa-arrow-right"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default Postlist;
