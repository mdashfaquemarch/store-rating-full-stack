import axios from "axios";

const API_BASE = "http://localhost:4000/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, 
});



export const fetchAdminDashboardData = async () => {
  try {
    const [statsRes, usersRes, storesRes] = await Promise.all([
      api.get("/dashboard/admin"),   
      api.get("/system/user"),   
      api.get("/system/store"), 
    ]);

    // console.log("admin stats :", statsRes.data?.data?.stats)
    // console.log("user  :", usersRes.data?.data?.users)
    // console.log("store  :", storesRes.data?.data)

    return {
      stats: statsRes.data?.data?.stats,
      users: usersRes.data?.data?.users,
      stores: storesRes.data?.data,
    };
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    throw error;
  }
};