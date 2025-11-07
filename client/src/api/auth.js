
import axios from "axios";

const API_BASE = "http://localhost:4000/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, 
});

export const signup = async (data) => {
  const res = await api.post("/auth/signup", data);
 
  return res.data;
};

export const login = async (data) => {
  const res = await api.post("/auth/signin", data);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/user/me"); 
  return res.data;
};

export const logout = async () => {
  const res = await api.get("/auth/logout");
   console.log(res.data);
  return res.data;
};
