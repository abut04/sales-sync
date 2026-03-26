import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial"
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "450px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
  };

  const inputWrapStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "16px"
  };

  const labelStyle = {
    fontWeight: "bold",
    fontSize: "14px",
    color: "#1e293b"
  };

  const inputStyle = {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "14px"
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "8px"
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginBottom: "10px", fontSize: "32px" }}>Welcome Back</h1>
        <p style={{ color: "#475569", marginBottom: "28px" }}>
          Log in to access your SalesSync dashboard.
        </p>

        <form onSubmit={handleLogin}>
          <div style={inputWrapStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputWrapStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Log In
          </button>
        </form>

        <p style={{ marginTop: "18px", color: "#475569" }}>
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "#2563eb", fontWeight: "bold" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;