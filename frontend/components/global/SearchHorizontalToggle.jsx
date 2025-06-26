import { Input } from "@/components/ui/input";
import { Search, AlertCircle, Clock, X, Trash2 } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SearchHorizontalToggle = ({ children, isOpen, searchComponentRef }) => {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    error,
    searchHistory,
    clearSearchHistory,
    removeFromHistory,
  } = useSearch();

  const handleUserClick = (username) => {
    router.push(`/othersProfile/${username}`);
  };

  const handleHistoryClick = (query) => {
    setSearchQuery(query);
  };

  const handleClearHistory = () => {
    clearSearchHistory();
  };

  const handleRemoveFromHistory = (e, query) => {
    e.stopPropagation();
    removeFromHistory(query);
  };

  return (
    <div>
      <div className={`flex items-center relative w-full h-screen`}>
        <div>{children}</div>
        <div
          ref={searchComponentRef}
          className={`absolute dark:bg-black border-l-1 border-neutral-300 dark:border-neutral-700 rounded-r-lg z-50 overflow-hidden ${
            isOpen && "animate-fadeScale shadow-right-left"
          } ${
            !isOpen && "animate-fadeOut"
          }  h-screen bg-white left-full transition-all ease-in-out duration-300`}
          style={{ width: !isOpen ? 0 : 400 }}
        >
          <div className={`mx-4 my-4`}>
            <h1 className={`text-2xl font-bold`}>Search</h1>
            <div className={`relative`}>
              <Input
                type={`search`}
                className={`mt-3 py-5 relative border-gray-300 text-black dark:text-white placeholder-black pl-10 dark:border-neutral-500`}
                placeholder={"Search users..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className={`absolute top-1/2 -translate-y-1/2 left-2`}
                color={`gray`} 
              />
            </div>
          </div>
          <hr className="border-t-1 dark:border-neutral-500 border-gray-300" />
          
          <div className="overflow-y-auto h-[calc(100vh-120px)]">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-32 text-red-500">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p>{error}</p>
              </div>
            ) : searchQuery ? (
              // Search Results
              <>
                {searchResults.length > 0 ? (
                  <div className="mb-3 mt-8 mx-5">
                    <h2 className="text-lg font-semibold mb-4">Search Results</h2>
                    <div className="grid gap-4">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 p-2 rounded-lg"
                          onClick={() => handleUserClick(user.username)}
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <Image
                              src={user.avatar?.url || "/images/unify_icon_2.svg"}
                              alt={user.username}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{user.username}</p>
                            <p className="text-sm text-gray-500">{`${user.firstName} ${user.lastName}`}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-32 text-gray-500">
                    No users found
                  </div>
                )}
              </>
            ) : (
              // Search History
              <div className="mb-3 mt-8 mx-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Searches
                  </h2>
                  {searchHistory.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </div>
                
                {searchHistory.length > 0 ? (
                  <div className="grid gap-2">
                    {searchHistory.map((query, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
                        onClick={() => handleHistoryClick(query)}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{query}</span>
                        </div>
                        <button
                          onClick={(e) => handleRemoveFromHistory(e, query)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 text-sm">
                    No recent searches
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHorizontalToggle;
