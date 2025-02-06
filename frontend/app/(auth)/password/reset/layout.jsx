const RootLayout = ({ children }) => {
  return (
    <div className={`w-full h-screen grid place-content-center`}>
      <div align={"center"}>
        <div className={`grid gap-5`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
