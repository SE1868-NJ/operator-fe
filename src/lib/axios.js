import axios from "axios";

const baseURL = "http://localhost:3050";
const authURL = "http://localhost:3000/api/v1";
// const authURL = "https://auth-backend-core.onrender.com/api/v1";

export const instance = axios.create({
    baseURL: baseURL,
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

export const authInstance = axios.create({
    baseURL: authURL,
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

// Request intercepter. Explain: If token is not exist on browser -> reject request
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Response intercepter.
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized! Redirecting to login...");
        }
        return Promise.reject(error);
    },
);

authInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Response intercepter.
authInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized! Redirecting to login...");
        }
        return Promise.reject(error);
    },
);
