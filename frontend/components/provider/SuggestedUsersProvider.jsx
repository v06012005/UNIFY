import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import Cookies from "js-cookie";

const SuggestedUsersContext = createContext();

export const SuggestedUsersProvider = ({ children }) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [followerUsers, setFollowerUsers] = useState([]);
  const [friendUsers, setFriendUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [postUsers, setPostUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  
 
  // Hàm lấy thông tin user
  const fetchUserInfo = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error(
          "Không tìm thấy token! Người dùng có thể chưa đăng nhập."
        );
        return null;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/my-info`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data || !response.data.id) {
        console.error("Không lấy được id từ API /users/my-info!");
        return null;
      }

      console.log("Lấy được id từ API:", response.data.id);
      setCurrentUserId(response.data.id);
      return response.data.id;
    } catch (err) {
      console.error(
        "Lỗi khi lấy thông tin người dùng:",
        err.response?.data || err.message
      );
      return null;
    }
  }, []);


  // Hàm lấy danh sách gợi ý
  const getSuggestedUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      if (!token) return;

      const id = await fetchUserInfo();
      if (!id) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/suggestions?currentUserId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuggestedUsers(response.data || []);
      console.log("Danh sách gợi ý:", response.data);
    } catch (err) {
      console.error(
        "Lỗi khi lấy danh sách gợi ý:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  }, [fetchUserInfo]);

  // Hàm lấy danh sách người theo dõi
  const getFollowerUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      if (!token) return;

      const id = await fetchUserInfo();
      if (!id) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/follower?currentUserId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFollowerUsers(response.data || []);
      console.log("Danh sách người theo dõi:", response.data);
    } catch (err) {
      console.error(
        "Lỗi khi lấy danh sách người theo dõi:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  }, [fetchUserInfo]);
  //Hàm lấy danh sách người đang theo dõi
  const getFollowingUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      if (!token) return;

      const id = await fetchUserInfo();
      if (!id) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/following?currentUserId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFollowingUsers(response.data || []);
      console.log("Danh sách người đang theo dõi:", response.data);
    } catch (err) {
      console.error(
        "Lỗi khi lấy danh sách người đang theo dõi:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  }, [fetchUserInfo]);
  //Hàm lấy danh sách bạn bè
  const getFriendUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      if (!token) return;

      const id = await fetchUserInfo();
      if (!id) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/friend?currentUserId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFriendUsers(response.data || []);
      console.log("Danh sách bạn bè:", response.data);
    } catch (err) {
      console.error(
        "Lỗi khi lấy danh sách bạn bè:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  }, [fetchUserInfo]);
 
  useEffect(() => {
    fetchUserInfo().then((id) => {
      if (id) {
        getSuggestedUsers();
        getFollowerUsers();
        getFollowingUsers();
        getFriendUsers();
      }
    });
  }, [
    fetchUserInfo,
    getSuggestedUsers,
    getFollowerUsers,
    getFriendUsers,
    getFollowingUsers,
  ]);

  return (
    <SuggestedUsersContext.Provider
      value={{
        suggestedUsers,
        getSuggestedUsers,
        followingUsers,
        getFollowingUsers,
        followerUsers,
        getFollowerUsers,
        friendUsers,
        getFriendUsers,
        postUsers,
        currentUserId,
        loading,
      }}
    >
      {children}
    </SuggestedUsersContext.Provider>
  );
};

export const useSuggestedUsers = () => {
  const context = useContext(SuggestedUsersContext);
  if (!context) {
    throw new Error(
      "useSuggestedUsers phải được sử dụng trong SuggestedUsersProvider!"
    );
  }
  return context;
};
