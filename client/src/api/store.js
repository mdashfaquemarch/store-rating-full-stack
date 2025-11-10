import axios from "axios";

const API_BASE = "https://store-rating-backend-xuoa.onrender.com/api/v1";

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

export const fetchAllStoresWithAverageRating = async () => {
    const storesRes = await api.get("/system/store");
    console.log(storesRes.data?.data);
    return storesRes.data?.data;
};

export const fetchStoreDashboard = async () => {
    try {
        const [dashboardRes, ratingRes] = await Promise.all([
            api.get("/dashboard/store"),
            api.get("/rating/store"),
        ]);

        const dashboardData = dashboardRes.data.data;
        const ratingData = ratingRes.data.data || [];

        console.log(dashboardData);
        console.log(ratingData);

        return {
            store: {
                id: dashboardData.id,
                name: dashboardData.name,
                address: dashboardData.address,
                owner: dashboardData.owner_name,
                email: dashboardData.owner_email,
                averageRating: dashboardData.averageRating,
                numberOfRating: dashboardData.numberOfRating,
            },
            ratings: ratingData,
        };
    } catch (error) {
        console.error("Failed to fetch store dashboard:", error);
        throw error;
    }
};

export const fetchStoreById = async (storeId) => {
    const [avgRatingRes, storeRes] = await Promise.all(
        [
            api.get(`/rating/${storeId}/average-rating`),
            api.get(`/store/${storeId}`),
        ]
    );
    
    const data = {
        store: storeRes.data?.data, averageRating: avgRatingRes.data?.data?.averageRating
    }

    return data;
}


export const fetchUserRating = async (storeId) => {
    
  const res = await api.get(`/rating/${storeId}/user-rating`);
  console.log(res)
  return res.data?.data?.userRating; // should return number (1–5)
};

export const submitOrUpdateRating = async (storeId, rating) => {
  const res = await api.post(`/rating/store/${storeId}`, { rating });
  console.log(res.data)
  return res.data?.data?.rating;
};