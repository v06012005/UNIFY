import axios from "axios";

function axiosResult() {
  axios
    .get("/api/get-cookie")
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}

export { axiosResult };
