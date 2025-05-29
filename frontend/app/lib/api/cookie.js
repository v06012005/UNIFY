import axios from "axios";

async function axiosResult() {
  try {
    const response = await axios.get("/api/get-cookie");
    console.log(response.data);
    return response.data; 
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error; 
  }
}

export { axiosResult };
