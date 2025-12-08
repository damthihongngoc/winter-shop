// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js"; // nếu db.js export default pool
import categoryRoutes from "./router/category.routes.js";
import productRouters from "./router/product.routes.js";
import colorRouters from "./router/color.router.js";
import sizeRouters from "./router/size.router.js";
import bannerRouters from "./router/banner.routes.js";
import productDetailRouters from "./router/productDetail.routes.js";
import appRoot from "app-root-path";
import path from "path";
import authRoutes from "./router/auth.routes.js";
import userRoutes from "./router/user.routes.js";
import cartRouters from "./router/cart.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  "/images",
  express.static(path.join(appRoot.path, "src/public/images"))
);

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRouters);
app.use("/api/colors", colorRouters);
app.use("/api/sizes", sizeRouters);
app.use("/api/product-details", productDetailRouters);
app.use("/api/auth", authRoutes);
app.use("/api/banners", bannerRouters);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRouters);

// Route test
app.get("/", (req, res) => {
  res.json({ message: "Server Node.js chạy ngon lành " });
});

app.get("/nhanVien", (req, res) => {
  res.json({ message: "Tui la nhan vien" });
});

app.get("/banner", async (req, res) => {
  const [banner] = await pool.query("SELECT * FROM banners");
  res.json({ data: banner });
});

app.get("/api", (req, res) => {
  res.json({ abc: "Hello" });
});

app.get("/api2", (req, res) => {
  res.json({ abc: "Hello 22222" });
});

app.get("/api-ne", (req, res) => {
  res.json({ abc: "Api Nè" });
});

// 📌 Lấy tất cả banners
app.get("/api/banners", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM banners ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Lấy banner theo ID
app.get("/api/banners/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM banners WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Banner không tồn tại" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Thêm banner mới
app.post("/api/banners", async (req, res) => {
  try {
    const { title, image_url, link } = req.body;
    const [result] = await pool.query(
      "INSERT INTO banners (title, image_url, link) VALUES (?, ?, ?)", [title, image_url, link]
    );
    res.status(201).json({ id: result.insertId, title, image_url, link });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Cập nhật banner theo ID
app.put("/api/banners/:id", async (req, res) => {
  try {
    const { title, image_url, link } = req.body;
    const [result] = await pool.query(
      "UPDATE banners SET title=?, image_url=?, link=? WHERE id=?", [title, image_url, link, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Banner không tồn tại" });
    }

    res.json({ id: req.params.id, title, image_url, link });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Xóa banner theo ID
app.delete("/api/banners/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM banners WHERE id=?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Banner không tồn tại" });
    }
    res.json({ message: "Xóa banner thành công ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const danhMucMonAn = {
  systemCategories: [{
    id: 10,
    name: "Mì xào, cơm trộn",
    slug: "mi-xao-com-tron",
    description: "Mì xào, cơm trộn",
    organizationId: 1,
    image_url: "5fe89569-3c8d-499e-a55d-26be3e0dc1a3.webp",
    userUpdate: 0,
    createDate: "2025-05-04T12:13:04.000Z",
    updateDate: "2025-05-04T12:13:04.000Z",
    isDeleted: false,
    parentId: 0,
    index: 0,
    order: 0,
    createUser: 0,
    image_url_map: "https://s3-api-stg.chothongminh.com/food/category-system/mi-xao-com-tron/5fe89569-3c8d-499e-a55d-26be3e0dc1a3.webp",
  },
  {
    id: 19,
    name: "Bánh Xèo",
    slug: "banh-xeo",
    description: "Bánh Xèo",
    organizationId: 1,
    image_url: "0f4099af-4ff8-43b2-a146-d4920193e5f9.webp",
    userUpdate: 0,
    createDate: "2025-05-04T12:12:44.000Z",
    updateDate: "2025-05-04T12:12:44.000Z",
    isDeleted: false,
    parentId: 0,
    index: 0,
    order: 0,
    createUser: 0,
    image_url_map: "https://s3-api-stg.chothongminh.com/food/category-system/banh-xeo/0f4099af-4ff8-43b2-a146-d4920193e5f9.webp",
  },
  {
    id: 21,
    name: "Bánh Mì",
    slug: "banh-mi",
    description: "Bánh Mì",
    organizationId: 1,
    image_url: "58f7b47a-f85a-4026-855d-02059a4b3ff4.webp",
    userUpdate: 0,
    createDate: "2025-05-04T12:07:26.000Z",
    updateDate: "2025-05-04T12:07:26.000Z",
    isDeleted: false,
    parentId: 0,
    index: 0,
    order: 0,
    createUser: 0,
    image_url_map: "https://s3-api-stg.chothongminh.com/food/category-system/banh-mi/58f7b47a-f85a-4026-855d-02059a4b3ff4.webp",
  },
  ],
  totalSystemCategories: 3,
};

app.get("/danh-muc-mon-an", (req, res) => {
  res.json({ output: danhMucMonAn });
});

app.get("/danh-sach-nguoi-dung", (req, res) => {
  res.json({ output: danhSachNguoiDung });
});

app.get("/danh-sach-nguoi-dung/:id", (req, res) => {
  const danhSachNguoiDung = [
    { ten: "Nam", tuoi: 12, id: 1 },
    { ten: "Mai", tuoi: 15, id: 2 },
    { ten: "Thu", tuoi: 19, id: 3 },
  ];

  const id = parseInt(req.params.id);
  const nguoiDung = danhSachNguoiDung.find((u) => u.id === id);

  if (nguoiDung) {
    res.json({ output: nguoiDung });
  } else {
    res.status(404).json({ message: "Không tìm thấy người dùng" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});