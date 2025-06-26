import { useState, useEffect } from "react";
import { searchUsers } from "@/app/api/services/searchService";

// Custom debounce hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export const useSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchHistory, setSearchHistory] = useState([]);

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Load search history from localStorage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem("searchHistory");
        if (savedHistory) {
            try {
                setSearchHistory(JSON.parse(savedHistory));
            } catch (error) {
                console.error("Error loading search history:", error);
            }
        }
    }, []);

    // Save search history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }, [searchHistory]);

    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedSearchQuery.trim()) {
                setSearchResults([]);
                setError(null);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const results = await searchUsers(debouncedSearchQuery);
                setSearchResults(results);

                // Add to search history if not already present
                if (!searchHistory.includes(debouncedSearchQuery)) {
                    setSearchHistory(prev => [debouncedSearchQuery, ...prev.slice(0, 9)]); // Keep only last 10 searches
                }
            } catch (error) {
                console.error("Search error:", error);
                setError(error.message || "An error occurred while searching");
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        performSearch();
    }, [debouncedSearchQuery, searchHistory]);

    const clearSearchHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem("searchHistory");
    };

    const removeFromHistory = (query) => {
        setSearchHistory(prev => prev.filter(item => item !== query));
    };

    return {
        searchQuery,
        setSearchQuery,
        searchResults,
        isLoading,
        error,
        searchHistory,
        clearSearchHistory,
        removeFromHistory,
    };
}; 