import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { loginUser } from "../../../service/auth.service";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginUser(form);
      console.log(res);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
     window.location.href = "/"
    } catch (err) {
      setError(err.response?.data?.error || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="container-login">
      {" "}
      <div className="auth-container">
        <h2> Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Đăng nhập</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
