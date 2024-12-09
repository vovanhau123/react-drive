const API_CONFIG = {
  // Base URL cho API
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",

  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY: "/auth/verify",
    RESEND_CODE: "/auth/resend-code",
  },

  // Files endpoints
  FILES: {
    DOWNLOAD: (fileId) => `/files/${fileId}/download`,
    DOWNLOAD_FOLDER: (folderId) => `/files/folder/${folderId}/download`,
  },

  // Folders endpoints
  FOLDERS: {
    CREATE: "/folders",
    GET_CONTENTS: (folderId) =>
      folderId ? `/folders/${folderId}` : "/folders",
    UPLOAD: (folderId) => `/folders/${folderId || "root"}/upload`,
  },

  // Share endpoints
  SHARE: {
    SHARE_ITEM: (itemId) => `/share/${itemId}`,
    GET_LINK: (itemId) => `/share/${itemId}/link`,
  },

  // Headers
  getHeaders: (options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
      ...options,
    };
    return headers;
  },

  // Full URL
  getFullURL: (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  },
};

export default API_CONFIG;
