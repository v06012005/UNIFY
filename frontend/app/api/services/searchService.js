import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8080";

const getToken = () => Cookies.get("token");

const createAxiosInstance = () => {
    const token = getToken();
    return axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        timeout: 10000,
    });
};

export const searchUsers = async (query) => {
    if (!query?.trim()) {
        return [];
    }

    try {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.get(`/users/search`, {
            params: { query: query.trim() },
        });
        return response.data;
    } catch (error) {
        console.error("Error searching users:", error);
        if (error.response) {
            throw new Error(error.response.data || "Error searching users");
        }
        throw new Error("Network error while searching users");
    }
}; 