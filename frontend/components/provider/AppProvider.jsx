"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {redirect, useRouter} from "next/navigation";

const API_URL_LOGIN = process.env.NEXT_PUBLIC_API_URL_LOGIN;
const API_URL_REFRESH = process.env.NEXT_PUBLIC_API_URL_REFRESH;
const API_URL_LOGOUT = process.env.NEXT_PUBLIC_API_URL_LOGOUT;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UserContext = createContext(null);

export const AppProvider = ({ children }) => {

    const [user, setUser] = useState({
        id: "",
        firstName: "",
        lastName: "",
        username: "",
        phone: "",
        email: "",
        password: "",
        registeredAt: "",
        gender: null,
        birthDay: "",
        location: "",
        education: "",
        status: 0,
        workAt: "",
    });
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL_LOGIN}`, { email, password }, {
                headers: { "Content-Type": "application/json" },
            });
            Cookies.set("token", response.data.token, {
                path: "/",
                sameSite: "Strict",
                secure: true,
                expires: 7,
            });
            getInfoUser().catch(error => console.log(error));
            if(!isAdmin){
                router.push("/");
            }
            router.push('/statistics/users')
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
        }
    };

    const refreshToken = async () => {
        try {
            const token = Cookies.get("token");
            if(!token) {
                setUser(null);
                setIsAdmin(false);
                redirect('/login');
            }
            const response = await axios.get(`${API_URL_REFRESH}`, {
                headers: {
                    "Authorization": `Bearer ${Cookies.get("token")}`,
                }
            });
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            Cookies.set("token", response.data.token, {
                path: "/",
                sameSite: "Strict",
                secure: true,
                expires: 7,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const logoutUser = async () => {
        try {
            await axios.get(`${API_URL_LOGOUT}`, {
                headers: {
                    "Authorization": `Bearer ${Cookies.get('token')}`,
                }
            });
            Cookies.remove("token", { path: "/" });
            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error.response?.data || error.message);
        }
    };

    const getInfoUser = async () => {
       try {
           const token = Cookies.get("token");
           const response = await axios.get(`${API_URL}/users/my-info`, {
               headers: {
                   Authorization: `Bearer ${token}`,
               }
           })
           if (response.data) {
               setUser(response.data);
           }
       }catch (err) {
           console.log(err);
       }

    }


    useEffect(() => {
        if(user) {
            setUser(user);
        }
    }, [user]);

    useEffect(() => {
        getInfoUser().catch(error => console.log(error));
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loginUser, refreshToken, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};


export const useApp = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useAuth must be used within an AppProvider");
    }
    return context;
};
