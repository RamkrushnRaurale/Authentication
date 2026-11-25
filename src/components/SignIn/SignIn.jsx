import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";

import eyeImg from "../Assets/Images/eye.png";
import eyeOff from "../Assets/Images/eye-off.png";
import MailIcon from "../Assets/Images/MailIcon.png";

import api from "./Api";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const goToDashboard = () => {
    setTimeout(() => {
      navigate("/Dashboard");
      setLoading(false);
    }, 2500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const response = await api.post("/login", {
        email: username,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;
      login(accessToken, refreshToken, user);

      goToDashboard();
    } catch (err) {
      console.log("Login Error:", err);

      /* ================= OFFLINE LOGIN ================= */
      if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
        if (username === "admin@gmail.com" && password === "admin@123") {
          const offlineUser = {
            id: 1,
            username: "Admin",
            email: "admin@gmail.com",
            role: "Admin",
          };

          login("offline-access-token", "offline-refresh-token", offlineUser);
          goToDashboard();
          return;
        }

        setLoading(false);
        setMessage(
          "Server unavailable. Use Offline Credentials: admin@gmail.com / admin@123"
        );
        setTimeout(() => setMessage(""), 5000);
        return;
      }

      setLoading(false);
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <>
      {/* ================= LOADER OVERLAY ================= */}
      {loading && (
        <div style={styles.loaderOverlay}>
          <div style={styles.loaderCard}>
            <div style={styles.spinner}>
              <div style={styles.spinnerRing} />
              <div style={styles.spinnerRingInner} />
            </div>
            <p style={styles.loaderText}>Signing you in</p>
            <p style={styles.loaderDots}>• • •</p>
          </div>
        </div>
      )}

      {/* ================= OFFLINE HINT ================= */}
      {message && <div style={styles.message}>{message}</div>}

      {/* ================= LOGIN PAGE ================= */}
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.hello}>Hello there,</h1>
          <h2 style={styles.welcome}>Welcome!</h2>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={styles.inputBox}>
              <span style={styles.icon}>
                <img src={MailIcon} alt="mail" style={styles.inputIcon} />
              </span>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Email"
                style={styles.input}
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div style={styles.inputBox}>
              <span style={styles.icon}>🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={styles.input}
                required
                disabled={loading}
              />
              <span
                style={styles.eye}
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={showPassword ? eyeImg : eyeOff}
                  alt="toggle"
                  style={styles.eyeIcon}
                />
              </span>
            </div>

            {/* Remember + Forgot */}
            <div style={styles.options}>
              <label style={styles.remember}>
                <input type="checkbox" disabled={loading} />
                Remember
              </label>
              <Link to="/ForgotPassword" style={styles.forgot}>
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Signup */}
            <p style={styles.signupText}>
              Don't have an account?
              <Link to="/SignUp" style={styles.signupLink}>
                {" "}Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f4f4",
    fontFamily: "Arial",
  },

  card: {
    width: "340px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },

  message: {
    marginTop: "15px",
    padding: "10px",
    background: "#dc3545",
    color: "#fff",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "14px",
  },

  hello: {
    margin: 0,
    color: "#5a54ff",
    fontSize: "32px",
    fontWeight: "700",
  },

  welcome: {
    marginTop: "5px",
    color: "#ff9800",
    fontSize: "28px",
    fontWeight: "700",
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    background: "#eef0ff",
    borderRadius: "8px",
    marginTop: "20px",
    padding: "12px",
  },

  icon: {
    marginRight: "10px",
    fontSize: "18px",
  },

  inputIcon: {
    width: "20px",
    height: "20px",
  },

  input: {
    border: "none",
    outline: "none",
    background: "transparent",
    flex: 1,
    fontSize: "15px",
  },

  eye: {
    cursor: "pointer",
  },

  eyeIcon: {
    width: "22px",
    height: "22px",
  },

  options: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "18px",
    fontSize: "14px",
  },

  remember: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  forgot: {
    textDecoration: "none",
    color: "#1a005d",
    fontWeight: "500",
  },

  button: {
    width: "100%",
    marginTop: "22px",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    background: "#14004d",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  signupText: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
  },

  signupLink: {
    color: "#5a54ff",
    textDecoration: "none",
    fontWeight: "bold",
  },

   /* ================= RAINBOW LOADER STYLES ================= */
  loaderOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(20, 0, 77, 0.7)", // Slightly darker background for better contrast
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  loaderCard: {
    background: "#fff",
    padding: "30px 40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "180px",
  },

  spinner: {
    position: "relative",
    width: "70px",
    height: "70px",
  },

  // Outer Ring: Rainbow colors
  spinnerRing: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: "5px solid transparent", // Make base transparent
    borderTop: "5px solid #ff0000", // Red
    borderRight: "5px solid #ffa500", // Orange
    borderBottom: "5px solid #ffff00", // Yellow
    borderLeft: "5px solid #00ff00", // Green
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
    boxShadow: "0 0 15px rgba(255, 0, 0, 0.4), 0 0 15px rgba(0, 255, 0, 0.4)", // Glow effect
  },

  // Inner Ring: Reverse rainbow colors
  spinnerRingInner: {
    position: "absolute",
    top: "12px",
    left: "12px",
    right: "12px",
    bottom: "12px",
    border: "4px solid transparent",
    borderTop: "4px solid #0000ff", // Blue
    borderRight: "4px solid #4b0082", // Indigo
    borderBottom: "4px solid #ee82ee", // Violet
    borderLeft: "4px solid #ff0000", // Red
    borderRadius: "50%",
    animation: "spin-reverse 1.2s linear infinite",
    boxShadow: "0 0 10px rgba(0, 0, 255, 0.5)", // Blue glow
  },

  loaderText: {
    marginTop: "20px",
    marginBottom: 0,
    fontSize: "16px",
    fontWeight: "700",
    // Rainbow Gradient Text
    background: "linear-gradient(90deg, #ff0000, #ffa500, #ffff00, #00ff00, #0000ff, #4b0082, #ee82ee)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "Arial",
  },

  loaderDots: {
    margin: "4px 0 0 0",
    letterSpacing: "4px",
    // Rainbow Gradient Dots
    background: "linear-gradient(90deg,  #0000ff, #4b0082, #ee82ee)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "20px",
    fontWeight: "bold",
    animation: "pulse 1.2s ease-in-out infinite",
  },
};