"use server";

import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { cache } from "react";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("token")?.value;
  const session = await decrypt(cookie);

  if (!session || !session?.sub) {
    return null;
  }

  return { isAuth: true, sub: session.sub };
});

export const getUser = cache(async () => {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  try {
    const response = await fetch("http://localhost:8080/users/my-info", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log("Failed to fetch user");
      return null;
    }

    const user = await response.json();

    return user;
  } catch (error) {
    console.log("Failed to fetch user");
    return null;
  }
});

export const savePost = async (post) => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const response = await fetch("http://localhost:8080/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      console.log(response);
      console.log("Response is not ok");
      return null;
    }

    const savedPost = await response.json();
    return savedPost;
  } catch (error) {
    console.log("Failed to fetch post and ran into an error, " + error);
    return null;
  }
};

export const updatePost = async (post) => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const response = await fetch("http://localhost:8080/posts", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      console.log(response);
      console.log("Response is not ok");
      return null;
    }

    const savedPost = await response.json();
    return savedPost;
  } catch (error) {
    console.log("Failed to fetch post and ran into an error, " + error);
    return null;
  }
};

export const saveMedia = async (postId, newMedia) => {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  try {

    const response = await fetch("http://localhost:8080/media", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMedia),
    });

    if (!response.ok) {
      console.log("Failed to save new media");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.log("Failed to save media:", error);
    return null;
  }
};

export const fetchPosts = async (page) => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  // const user = await getUser();

  try {
    const response = await fetch(`http://localhost:8080/posts/personalized?page=${page}&size=10`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("Failed to fetch posts");
      return null;
    }

    const myPosts = await response.json();
    return myPosts;
  } catch (error) {
    console.log("Failed to fetch posts: " + error);
    return null;
  }
};

export const fetchPostList = async () => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const response = await fetch("http://localhost:8080/posts/admin/list", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("Failed to fetch posts");
      return null;
    }

    const postlist = await response.json();
    return postlist;
  } catch (error) {
    console.log("Failed to fetch posts: " + error);
    return null;
  }
};

export const fetchPostById = async (postId) => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const response = await fetch(
      "http://localhost:8080/posts/post_detail/" + postId,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to fetch posts");
      return null;
    }

    const post = await response.json();
    return post;
  } catch (error) {
    console.log("Failed to fetch posts: " + error);
    return null;
  }
};

export const fetchPostsByDate = async (start, end) => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const response = await fetch(
      "http://localhost:8080/posts/filter/" + start + "/" + end,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to fetch posts");
      return null;
    }

    const postlist = await response.json();
    return postlist;
  } catch (error) {
    console.log("Failed to fetch posts: " + error);
    return null;
  }
};

export const insertHashtags = async (hashtags) => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const response = await fetch("http://localhost:8080/hashtags/saveAll", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hashtags),
    });

    if (!response.ok) {
      console.log("Failed to fetch posts");
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Failed to fetch posts: " + error);
    return null;
  }
};
export const insertHashtagDetails = async (hashtags) => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const response = await fetch(
      "http://localhost:8080/hashtag-details/saveAll",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hashtags),
      }
    );

    if (!response.ok) {
      console.log("Failed to fetch posts");
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Failed to fetch posts: " + error);
    return null;
  }
};

export const fetchPostsByHashtag = async (content) => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  console.log(content);

  try {
    const response = await fetch(
      "http://localhost:8080/posts/hashtag/" + content,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "force-cache",
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.log("Failed to fetch posts, please check again");
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Failed to fetch posts: " + error);
    return null;
  }
};

export const fetchSuggestedUsers = async (userId) => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const response = await fetch("http://localhost:8080/users/suggestions?currentUserId=" + userId, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("Failed to fetch users");
      return null;
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.log("Failed to fetch users: " + error);
    return null;
  }
};
