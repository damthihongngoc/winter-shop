import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import { registerUser } from "../../../service/auth.service";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await registerUser(form);
      alert("Đăng ký thành công! Mời bạn đăng nhập.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Đăng ký thất bại!");
    }
  };

  return (
    <div className="container-login">
      <div className="auth-container">
        <h2>🧍‍♀️ Đăng ký</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Họ và tên"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            type="text"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <button type="submit">Đăng ký</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
