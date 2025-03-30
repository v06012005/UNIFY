import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ExploreLayout({ children }) {
  return (
    <NextThemesProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-black">
        <nav className="bg-white p-4 shadow-md dark:bg-black">
          <h1 className="text-2xl font-bold">Explore</h1>
        </nav>
        <main className="container mx-auto p-4">{children}</main>
      </div>
    </NextThemesProvider>
  );
}
