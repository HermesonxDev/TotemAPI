import axios from "axios";

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
  headers: {
    "X-CSRF-TOKEN": csrfToken,
    "X-Requested-With": "XMLHttpRequest",
  },
});

api.get("/sanctum/csrf-cookie");

export default api;
