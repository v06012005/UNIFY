import SideBar from "../../components/global/SideBar";

const RootLayout = ({ children }) => {
  return (
    <>
      <div className="flex w-full">
        <aside className="w-20 flex-none">
          <SideBar />
        </aside>
        <main className="w-full flex-initial">{children}</main>
      </div>
    </>
  );
};

export default RootLayout;
