import axios from "axios";

const API_BASE = "https://store-rating-backend-xuoa.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, 
});


