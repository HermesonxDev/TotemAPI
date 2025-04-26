import axios from "axios";

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const baseURL = isLocalhost
  ? "http://127.0.0.1:8000"
  : "https://dash.berp.app.br";


const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "X-CSRF-TOKEN": csrfToken,
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Pega o cookie CSRF do sanctum (usado no Laravel)
api.get("/sanctum/csrf-cookie");

export default api;
