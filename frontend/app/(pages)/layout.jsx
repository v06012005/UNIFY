import SideBar from "../../components/global/SideBar";

const RootLayout = ({ children }) => {
  return (
    <>
      <div className="flex w-full">
        <aside className="w-28">
          <SideBar />
        </aside>
        <main className="w-full">{children}</main>
      </div>
    </>
  );
};

export default RootLayout;
