import Image from "next/image";
import SideBar from "./components/SideBar";
import Post from "./components/Post";

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
