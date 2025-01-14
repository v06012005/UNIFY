const Page = () => {
  return (
    <div className={"min-h-screen w-full flex flex-col justify-start p-10"}>
      <h1 className={"font-extrabold text-3xl font-mono mb-4"}>Notification</h1>
      <div className={"grid gap-5 place-content-center"}>
        {/* Start */}
        <div className={"p-4 bg-gray-100"}>
          <table className={"table-fixed w-full"}>
            <tbody>
              <tr className={"h-16 px-2"}>
                <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                <td>Malcolm Lockyer</td>
                <td>1961</td>
              </tr>
              <tr className={"h-16 px-2"}>
                <td>Witchy Woman</td>
                <td>The Eagles</td>
                <td>1972</td>
              </tr>
              <tr className={"h-16 px-2"}>
                <td>Shining Star</td>
                <td>Earth, Wind, and Fire</td>
                <td>1975</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* End */}
      </div>
    </div>
  );
};

export default Page;
