import SideBar from "../../components/global/SideBar";


const RootLayout = ({children}) =>  {
    return (
        <>
          <div className="flex">
          <aside className="w-28">
            <SideBar />
          </aside>
      <div className="basis-3/4 border py-8">
        <div className="w-3/4 flex flex-col mx-auto">
          {children}
        </div>
      </div>
      <div className="basis-1/4 border">a</div>
    </div>
        </>
    );
}

export default RootLayout;

