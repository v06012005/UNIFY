import Image from "next/image";
import SideBar from "./components/SideBar";

export default function Home() {
  return (
    <div className="flex">
      <SideBar></SideBar>
      <div className="text-3xl">unify</div>
    </div>

  );
}
