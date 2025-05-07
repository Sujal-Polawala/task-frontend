// /api/notifications.js
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

export const getNotifications = async (userId, token) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/notifications/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("API response data:", res.data);
    return res.data; // ✅ axios uses res.data
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return null;
  }
};
