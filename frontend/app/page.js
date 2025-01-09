
import Image from "next/image";
import SideBar from "@/components/global/SideBar";
import Post from "@/components/global/Post";

export default function Home({ children }) {
  return (
    <div className="flex">
      <aside>
        <SideBar></SideBar>
      </aside>
      <main className="w-full">
        {children}
        <Post></Post>
      </main>
    </div>

  );
}
