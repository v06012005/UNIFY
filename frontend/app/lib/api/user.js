import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

const authHeaders = () => {
  const token = Cookies.get("token");
  return { Authorization: `Bearer ${token}` };
};

export const getMyInfo = async () => {
  const res = await api.get("/users/my-info", {
    headers: authHeaders(),
  });
  return res.data;
};

export const getSuggestedUsers = (id) =>
  api
    .get(`/users/suggestions?currentUserId=${id}`, { headers: authHeaders() })
    .then((res) => res.data);

export const getFollowingUsers = (id) =>
  api
    .get(`/users/following?currentUserId=${id}`, { headers: authHeaders() })
    .then((res) => res.data);

export const getFollowerUsers = (id) =>
  api
    .get(`/users/follower?currentUserId=${id}`, { headers: authHeaders() })
    .then((res) => res.data);

export const getFriendUsers = (id) =>
  api
    .get(`/users/friend?currentUserId=${id}`, { headers: authHeaders() })
    .then((res) => res.data);
