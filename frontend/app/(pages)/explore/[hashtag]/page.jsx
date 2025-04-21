"use client";

import { fetchPostsByHashtag } from "@/lib/dal";
import Picture from "@/components/global/Exp_Picture";
import Video from "@/components/global/Exp_Video";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

const Page = () => {
  const hashtagContent = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const fetchedPost = await fetchPostsByHashtag(hashtagContent.hashtag);
      setPosts(fetchedPost);
    }

    fetchPosts();
  }, []);

  return (
    <div className={"w-full h-auto flex flex-wrap mt-8 mb-5 justify-center"}>
      <div className={"grid grid-cols-4 gap-2"}>
        {posts?.map((post) => {
          return <Picture key={post.id} post={post} url={post?.media[0].url} />;
        })}
      </div>
    </div>
  );
};

export default Page;
