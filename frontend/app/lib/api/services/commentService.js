const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchComments = async (postId, token) => {
  if (!postId) {
    // console.error("postId is undefined");
    return [];
  }

  if (!token) {
    console.error("Token không tồn tại");
    return [];
  }

  try {
    const response = await fetch(`${API_URL}/comments/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        console.error("Response is not JSON");
        return [];
      }
    } else {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

/**
 * Gửi một comment mới
 */
export const postComment = async (userId, postId, content, token, parentId = null) => {
  if (!userId) {
    throw new Error("User is not logged in");
  }
  if (!postId || !content || !token) {
    throw new Error("Missing required parameters: postId, content, or token");
  }

  try {
    const response = await fetch(`${API_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        postId,
        content,
        parentId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Comment posted successfully:", data);
      return data;
    } else {
      const errorText = await response.text();

     
      const knownErrors = [
        "This post has comments disabled",
        "The post is not available for commenting",
      ];

      if (knownErrors.includes(errorText)) {
        throw new Error(errorText);
      }

    
      console.error("Server responded with error:", response.status, errorText);
      throw new Error(errorText || "Something went wrong.");
    }
  } catch (error) {
    const knownErrors = [
      "This post has comments disabled",
      "The post is not available for commenting",
    ];

    if (knownErrors.includes(error.message)) {
      throw error;
    }

    console.error("Error submitting comment:", error.message);
    throw error;
  }
};
