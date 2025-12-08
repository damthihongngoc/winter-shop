# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

CLIENT/ ← Thư mục gốc của dự án Vite + React

├── node_modules/ ← Tự động tạo – chứa toàn bộ package đã cài
│
├── public/ ← File tĩnh (ảnh, favicon, logo… không qua bundler)
│
├── src/ ← Toàn bộ mã nguồn chính
│ │
│ ├── admin-page/ ← Khu vực dành riêng cho Admin Panel
│ │ │
│ │ ├── component/ ← Các component UI tái sử dụng cho admin
│ │ │
│ │ ├── navbar-admin.jsx ← Navbar riêng cho admin
│ │ │
│ │ ├── page/ ← Tập hợp các trang (page) cho admin
│ │ │ ├── category-page/ ← Trang quản lý danh mục sản phẩm
│ │ │ ├── color-page/ ← Trang quản lý màu sắc
│ │ │ ├── landing-page/ ← Trang landing admin (nếu có)
│ │ │ ├── product-detail-page/ ← Trang chi tiết sản phẩm trong admin
│ │ │ ├── product-page/ ← Trang quản lý sản phẩm
│ │ │ └── size-page/ ← Trang quản lý kích thước
│ │ │
│ │ ├── service/ ← Chứa hàm gọi API riêng cho admin (CRUD)
│ │ │
│ │ └── router-admin.jsx ← File định tuyến (route) dành riêng cho khu vực admin
│ │
│ │
│ ├── assets/ ← Chứa hình ảnh, icon, file media dùng chung
│ │
│ ├── authentication/ ← Các xử lý liên quan đến đăng nhập / bảo mật
│ │ ├── axiosInstance.jsx ← Cấu hình Axios (token, baseURL…)
│ │ └── guardRoute.jsx ← Chặn truy cập route nếu chưa đăng nhập
│ │
│ ├── component/ ← Các component tái sử dụng toàn dự án (Header, Btn…)
│ │
│ ├── service/ ← Các hàm gọi API dùng chung (user, sản phẩm…)
│ │
│ ├── PRO/ ← Khu vực dành cho user PRO / tài khoản cao cấp (nếu có)
│ │ └── user-view/
│ │ ├── component/ ← Component dành riêng cho trang PRO
│ │ └── page/ ← Các trang dành cho PRO (dashboard, statistics…)
│ │
│ ├── PS/ ← Khu vực chức năng profile cá nhân
│ │ └── profile/ ← Các trang/chức năng liên quan profile user
│ │
│ ├── router-user.jsx ← Router dành cho người dùng bình thường (user view)
│ │
│ ├── web-view/ ← Các trang giao diện chính (Home, About, Contact…)
│ │
│ ├── css/ ← Chứa các file CSS tách riêng
│ │ ├── App.css
│ │ └── index.css
│ │
│ ├── App.jsx ← Component gốc, nơi đặt router chính
│ ├── main.jsx ← Điểm vào của ứng dụng (render React vào DOM)
│ │
│
├── .gitignore ← Tệp cấu hình Git
├── eslint.config.js ← Quy định format / linting
├── index.html ← File HTML gốc cho Vite
├── note_run.txt ← Ghi chú cá nhân khi chạy dự án
├── package-lock.json ← Khóa version package
├── package.json ← Danh sách package + scripts
├── README.md ← Ghi chú dự án
└── vite.config.js ← Cấu hình công cụ build Vite

const apiUrl = import.meta.env.VITE_URL_SERVER;
