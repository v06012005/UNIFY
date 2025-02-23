import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const SuggestedUsersContext = createContext();

export const SuggestedUsersProvider = ({ children }) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");
  const getSuggestedUsers = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("Không tìm thấy token! Người dùng có thể chưa đăng nhập.");
        return;
      }
      const userInfoResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/my-info`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!userInfoResponse.data || !userInfoResponse.data.username) {
        console.error("Không lấy được username từ API /users/my-info!");
        return;
      }
  
      const username = userInfoResponse.data.username;
      console.log("Lấy được username từ API:", username);
  
      setLoading(true);
  
      const suggestionsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/suggestions?currentUsername=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (suggestionsResponse.data) {
        console.log("Danh sách gợi ý:", suggestionsResponse.data);
        setSuggestedUsers(suggestionsResponse.data);
      } else {
        console.warn("API trả về nhưng không có dữ liệu.");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách gợi ý:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const usernameFromCookie = Cookies.get("username");
    if (usernameFromCookie) {
      getSuggestedUsers(usernameFromCookie);
    }
  }, []);

  return (
    <SuggestedUsersContext.Provider value={{ suggestedUsers, getSuggestedUsers, loading }}>
      {children}
    </SuggestedUsersContext.Provider>
  );
};

export const useSuggestedUsers = () => {
  const context = useContext(SuggestedUsersContext);
  if (!context) {
    throw new Error("useSuggestedUsers phải được sử dụng trong SuggestedUsersProvider!");
  }
  return context;
};
