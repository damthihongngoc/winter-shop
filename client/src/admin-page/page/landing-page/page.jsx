import { motion } from "framer-motion";

export default function AdminPage() {
  return (
    <div
      style={{
        background: "#fff",
        minHeight: "100vh",
        color: "#f8fafc",
        width: "100%",
        fontFamily: "Inter, sans-serif",
      }}
    >
    
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          maxWidth: 900,
          margin: "60px auto",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.2rem",
            marginBottom: 10,
            fontWeight: "bold",
            color: "#60a5fa",
          }}
        >
          Trang Admin
        </h1>


        {/*  menu  */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.15 },
            },
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            marginTop: 40,
          }}
        >
          {[
            {
              title: " Quản lý Banner",
              color: "#f59e0b",
              link: "/admin/banner",
            },
            {
              title: " Quản lý Danh mục",
              color: "#10b981",
              link: "/admin/category",
            },
            {
              title: " Quản lý Sản phẩm",
              color: "#3b82f6",
              link: "/admin/product",
            },
            {
              title: " Quản lý Màu sắc",
              color: "#ec4899",
              link: "/admin/color",
            },
            {
              title: " Quản lý Kích cỡ",
              color: "#8b5cf6",
              link: "/admin/size",
            },
            {
              title: " Quản lý Chi tiết Sản phẩm",
              color: "#14b8a6",
              link: "/admin/product-detail",
            },
          ].map((item, i) => (
            <motion.a
              key={i}
              href={item.link}
              whileHover={{ scale: 1.08, rotate: 1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                background: "#1e293b",
                borderRadius: 16,
                padding: "25px 10px",
                color: item.color,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "1.1rem",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              {item.title}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
