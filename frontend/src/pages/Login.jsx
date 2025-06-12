// Login.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const role = sessionStorage.getItem("role");
      redirectByRole(role);
    }
  }, []);

  const redirectByRole = (role) => {
    if (role === "admin" || role === "employee") navigate("/");
    else if (role === "anonymous_reporter") navigate("/submit");
    else navigate("/login");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/login",
        new URLSearchParams({
          username: form.username,
          password: form.password,
        })
      );

      const token = response.data.access_token;
      const decoded = jwtDecode(token);
      const role = decoded.role;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role);

      redirectByRole(role);
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Human Rights MIS Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(145deg, #94c8b0, #00695c)",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#fff",
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    padding: "30px 40px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    color: "#333",
    fontSize: "22px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4e4376",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  error: {
    color: "red",
    marginTop: "10px",
    fontSize: "14px",
  },
};

export default Login;
