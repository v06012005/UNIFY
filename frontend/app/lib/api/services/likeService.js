// services/likeService.js
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getToken = () => Cookies.get("token");

export const getLikeStatus = async (userId, postId) => {
  const token = getToken();
  const res = await fetch(
    `${API_URL}/liked-posts/is-liked/${userId}/${postId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.ok ? res.json() : false;
};

export const getLikeCount = async (postId) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/liked-posts/countLiked/${postId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.ok ? res.json() : 0;
};

export const likePost = async (userId, postId) => {
  const token = getToken();
  return fetch(`${API_URL}/liked-posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, postId }),
  });
};

export const unlikePost = async (userId, postId) => {
  const token = getToken();
  return fetch(`${API_URL}/liked-posts/${userId}/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
