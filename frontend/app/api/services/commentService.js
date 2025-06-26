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

/**
 * Fetch all reported comments (for admin)
 */
export const fetchReportedComments = async (token) => {
  try {
    const response = await fetch(`${API_URL}/reports/allComments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching reported comments:", error);
    return [];
  }
};

/**
 * Update the status of a report (approve/reject)
 * @param {string} reportId
 * @param {number} status (e.g., 1 = approved, 2 = rejected)
 * @param {string} token
 */
export const updateReportStatus = async (reportId, status, token) => {
  try {
    const response = await fetch(`${API_URL}/reports/${reportId}/status?status=${status}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error("Error updating report status:", error);
    throw error;
  }
};

/**
 * Fetch post details by postId
 * @param {string} postId
 * @param {string} token
 */
export const fetchPostDetails = async (postId, token) => {
  try {
    const response = await fetch(`${API_URL}/posts/post_detail/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching post details:", error);
    return null;
  }
};

/**
 * Report a comment
 * @param {string} commentId - The ID of the comment to report
 * @param {string} reason - The reason for reporting
 * @param {string} token - Authentication token
 */
export const createCommentReport = async (commentId, reason, token) => {
  try {
    const response = await fetch(`${API_URL}/reports/comment?reportedId=${commentId}&reason=${encodeURIComponent(reason)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      const errorText = await response.text();
      return { error: errorText };
    }
  } catch (error) {
    console.error("Error reporting comment:", error);
    return { error: error.message };
  }
};

/**
 * Delete a comment
 * @param {string} commentId - The ID of the comment to delete
 * @param {string} token - Authentication token
 */
export const deleteComment = async (commentId, token) => {
  try {
    const response = await fetch(`${API_URL}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const errorText = await response.text();
      return { error: errorText };
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { error: error.message };
  }
};
