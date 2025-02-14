import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8080/api/auth/login";

export const login = async (username, password) => {
    try {
        console.log(API_URL);

        const response =  await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password}), // ✅ Corrected format
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json(); // ✅ Fixed: Added `await` here
        console.log(result);

        Cookies.set("token", result.token, { expires: 7 }); // ✅ Store token in cookies
        return result;

    } catch (error) {
        console.error("Login failed:", error.message);
        throw error;
    }
};

export const logout = () => {
    Cookies.remove("token");
    window.location.href = "/login";
};
