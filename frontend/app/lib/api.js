export async function addComment(postId, userId, content, parentId = null) {
    const response = await fetch("http://localhost:8080/api/comments/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId, content, parentId }),
    });
    return await response.json();
  }
  