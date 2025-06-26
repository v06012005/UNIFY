import { Input } from "@/components/ui/input";
import avartar from "@/public/images/avatar.png";
import { Search } from "lucide-react";
import UserHistorySearch from "@/components/global/UserHistorySearch";
import TextSearchHistory from "@/components/global/TextSearchHistory";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "@/config/api";
import Link from "next/link";

const SearchHorizontalToggle = ({ children, isOpen, searchComponentRef }) => {
  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Debounce function to prevent too many API calls
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleSearch = useCallback(async (value) => {
    // Input validation
    if (!value || value.trim().length === 0) {
      setSearch([]);
      setError(null);
      return;
    }

    // Trim and validate search term
    const trimmedValue = value.trim();
    if (trimmedValue.length < 2) {
      setError("Please enter at least 2 characters");
      setSearch([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if token exists
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.get(`${API_URL}/users/search`, {
        params: {
          username: trimmedValue,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000, // 5 second timeout
      });

      // Validate response data
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format");
      }

      setSearch(response.data);
      
      // Add to search history if not already present
      if (response.data.length > 0) {
        setSearchHistory(prev => {
          const newHistory = [trimmedValue, ...prev.filter(term => term !== trimmedValue)].slice(0, 10);
          return newHistory;
        });
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        setError("Request timed out. Please try again.");
      } else if (error.response) {
        // Handle different HTTP status codes
        switch (error.response.status) {
          case 401:
            setError("Please log in to continue");
            break;
          case 403:
            setError("You don't have permission to perform this action");
            break;
          case 404:
            setError("No users found");
            break;
          case 429:
            setError("Too many requests. Please try again later");
            break;
          default:
            setError(error.response?.data?.message || "An error occurred while searching");
        }
      } else if (error.request) {
        setError("Network error. Please check your connection");
      } else {
        setError(error.message || "An unexpected error occurred");
      }
      setSearch([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => handleSearch(value), 300),
    [handleSearch]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleHistoryClick = (term) => {
    setSearchTerm(term);
    handleSearch(term);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
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
                placeholder={"Search by username"} 
                value={searchTerm}
                onChange={handleInputChange}
                disabled={loading}
              />
              <Search
                className={`absolute top-1/2 -translate-y-1/2 left-2`}
                color={`gray`} 
              />
            </div>
          </div>
          <hr className="border-t-1 dark:border-neutral-500 border-gray-300" />
          <div className={`mb-3 mt-8 mx-5 grid gap-7`}>
            {loading && <div className={`text-center`}>Loading...</div>}
            {error && <div className={`text-center text-red-500`}>{error}</div>}
            {!loading && !error && search.length === 0 && searchTerm.length >= 2 && (
              <div className={`text-center`}>No users found</div>
            )}
            {search.length > 0 && search.map((userSearch) => (
              <Link 
                href={`/othersProfile/${userSearch.username}`} 
                className="w-full" 
                key={userSearch.id}
              >
                <UserHistorySearch
                  key={userSearch.id}
                  avatar={userSearch.avatar?.url || avartar}
                  username={userSearch.username}
                  profile={`${userSearch.firstName || ''} ${userSearch.lastName || ''}`.trim() || 'No name provided'}
                />
              </Link>
              
            ))}
            {searchHistory.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Recent Searches</h3>
                  <button 
                    onClick={clearSearchHistory}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Clear History
                  </button>
                </div>
                {searchHistory.map((term, index) => (
                  <TextSearchHistory 
                    key={index} 
                    text={term} 
                    onClick={() => handleHistoryClick(term)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHorizontalToggle;
