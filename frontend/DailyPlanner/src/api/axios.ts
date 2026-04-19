import axios from "axios";

const instance = axios.create({
    baseURL: "https://localhost:7100/api/",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})

instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default instance;