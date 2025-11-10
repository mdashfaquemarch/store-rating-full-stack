import axios from "axios";

const API_BASE = "https://store-rating-full-stack-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, 
});


