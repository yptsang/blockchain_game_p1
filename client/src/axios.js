import axios from 'axios'
import Cookies from 'js-cookie'
//import { EXPRESS_SERVER_URL } from "./config"

const instance = axios.create({
    timeout: 10000
});

// alway send token
instance.interceptors.request.use(function (config) {
    const token = Cookies.get('token');
    config.headers.Authorization = token;
    return config;
});

export default instance