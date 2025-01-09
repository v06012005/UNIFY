
import Image from "next/image";
import Post from "@/components/global/Post";

export default function Home({ children }) {
  return (
    <div className="flex">
      <div className="basis-3/4 border py-8">
        <div className="w-3/4 flex flex-col mx-auto">
          <Post></Post>
          <Post></Post>
          <Post></Post>
        </div>
      </div>
      <div className="basis-1/4 border">a</div>
    </div>

  );
}
