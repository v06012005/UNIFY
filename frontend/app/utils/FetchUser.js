
import Cookies from 'js-cookie';
import axios from "axios";

const URL_FETCH = "http://localhost:8080/users/refresh";

let tokenResponse;
let isValidToken = false;

export const fetchUser = async () => {
    const token = Cookies.get('token');
    if (!token) {
        isValidToken = true;
        return;
    }
    await axios.get(URL_FETCH, {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    }).then((response) => {tokenResponse = response.data.token})
}

export {
    tokenResponse,
    isValidToken
}