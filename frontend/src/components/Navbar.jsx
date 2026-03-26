import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const navStyle = {
    display: "flex",
    gap: "20px",
    padding: "20px 40px",
    backgroundColor: "#111827",
    color: "white",
    alignItems: "center",
    flexWrap: "wrap"
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold"
  };

  const buttonStyle = {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>Login</Link>
      <Link to="/signup" style={linkStyle}>Signup</Link>
      <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
      <Link to="/add-log" style={linkStyle}>Add Log</Link>
      <Link to="/history" style={linkStyle}>History</Link>
      <Link to="/prediction" style={linkStyle}>Prediction</Link>

      <button onClick={handleLogout} style={buttonStyle}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;