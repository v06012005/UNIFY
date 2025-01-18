import SideBar from "../../components/global/SideBar";

const RootLayout = ({ children }) => {
  return (
    <>
      <div className="flex w-full ">
        <aside className="w-20 z-50 flex-none">
              <div className={`w-20 fixed`}>
                  <SideBar/>
              </div>
        </aside>
        <main className="w-full flex-initial z-10">{children}</main>
      </div>
    </>
  );
};

export default RootLayout;
