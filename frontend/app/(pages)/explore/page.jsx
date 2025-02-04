import Picture from "@/components/global/Exp_Picture";
import Video from "@/components/global/Exp_Video";

const Page = () => {
  return (
    <div className={"w-full h-auto flex flex-wrap mt-8 mb-5 justify-center"}>
      <div className={"grid grid-cols-4 gap-2"}>
        <Picture />
        <Video />
        <Picture />
        <Video />
        <Picture />
        <Video />
      </div>
    </div>
  );
};

export default Page;
