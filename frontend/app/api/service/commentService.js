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
      return await response.json(); // Trả về dữ liệu bình luận nếu thành công
    } else {
      const errorText = await response.text();
      throw new Error(`Server error: ${errorText}`);
    }
  } catch (error) {
    console.error("Error submitting comment:", error);
    throw new Error("Failed to submit comment");
  }
};