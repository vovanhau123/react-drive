import axios from "axios";
import API_CONFIG from "../config/api.config";

const folderService = {
  // Tạo folder mới
  createFolder: async (name, parentId = null) => {
    const response = await axios.post(
      API_CONFIG.getFullURL(API_CONFIG.FOLDERS.CREATE),
      { name, parentId },
      { headers: API_CONFIG.getHeaders() }
    );
    return response.data;
  },

  // Lấy nội dung folder
  getFolderContents: async (folderId) => {
    try {
      const response = await axios.get(
        API_CONFIG.getFullURL(API_CONFIG.FOLDERS.GET_CONTENTS(folderId)),
        { headers: API_CONFIG.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Get folder contents error:", error);
      throw error.response?.data || { message: "Failed to get folder contents" };
    }
  },

  // Upload files
  uploadFiles: async (folderId, files, onProgress) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        API_CONFIG.getFullURL(API_CONFIG.FOLDERS.UPLOAD(folderId)),
        formData,
        {
          headers: API_CONFIG.getHeaders({ "Content-Type": "multipart/form-data" }),
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress?.(percentCompleted);
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Upload files error:", error);
      throw error.response?.data || { message: "Failed to upload files" };
    }
  },

  // Download một file
  downloadItem: async (itemId) => {
    try {
      const response = await axios({
        url: API_CONFIG.getFullURL(API_CONFIG.FILES.DOWNLOAD(itemId)),
        method: "GET",
        responseType: "blob",
        headers: API_CONFIG.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Download error:", error);
      throw error.response?.data || { message: "Failed to download file" };
    }
  },

  // Download folder
  downloadFolder: async (folderId) => {
    try {
      const response = await axios({
        url: API_CONFIG.getFullURL(API_CONFIG.FILES.DOWNLOAD_FOLDER(folderId)),
        method: "GET",
        responseType: "blob",
        headers: API_CONFIG.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Download folder error:", error);
      throw error.response?.data || { message: "Failed to download folder" };
    }
  },
};

export default folderService;
