import axios from "axios";

// Tạo instance của axios
const apiUrl = import.meta.env.VITE_URL_SERVER;

const axiosInstance = axios.create({
  baseURL: apiUrl, // Thay đổi URL này thành URL của API của bạn
});

// Thêm interceptor để tự động thêm token vào headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Đảm bảo gửi cookie với yêu cầu
    config.withCredentials = true; // Thêm dòng này

    // Thay đổi header Content-Type chỉ khi gửi FormData
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      console.log("Token hết hạn, đăng xuất người dùng");

      // Xóa token
      localStorage.removeItem("token");

      // Nếu bạn lưu thêm user info
      localStorage.removeItem("user");

      // Redirect về trang login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
