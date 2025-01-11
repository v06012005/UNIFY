import SideBar from "../../components/global/SideBar";

const RootLayout = ({ children }) => {
  return (
    <>
      <div className="flex w-full">
        <aside className="flex-none w-20">
          <SideBar />
        </aside>
        <main className="flex-initial w-full">{children}</main>
      </div>
    </>
  );
};

export default RootLayout;
