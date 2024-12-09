import axios from "axios";

const API_URL = "https://5c7b-42-117-143-208.ngrok-free.app/api";

const shareService = {
  shareItem: async (itemId, shareSettings) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/share/${itemId}`,
      shareSettings,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getShareLink: async (itemId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/share/${itemId}/link`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default shareService;
