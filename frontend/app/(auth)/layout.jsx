import { ThemeProvider as NextThemesProvider } from "next-themes";
const RootLayout = ({ children }) => {
  return (
    <>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <div className={`w-full h-screen`}>{children}</div>
      </NextThemesProvider>
    </>
  );
};

export default RootLayout;
