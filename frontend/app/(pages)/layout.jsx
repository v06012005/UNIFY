import SideBar from "../../components/global/SideBar";

const RootLayout = ({ children }) => {
  return (
    <>
      <div className="flex">
        <aside className="w-28">
          <SideBar />
        </aside>
        <main> {children}</main>
      </div>
    </>
  );
};

export default RootLayout;
