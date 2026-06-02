import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";

import eyeImg from "../Assets/Images/eye.png";
import eyeOff from "../Assets/Images/eye-off.png";
import MailIcon from "../Assets/Images/MailIcon.png";

import api from "./Api";

export default function Login() {

  const [username, setUsername] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      // Backend Login API
      const response = await api.post("/login", {
        email: username,
        password,
      });

      // JWT Token
      const token = response.data.token;

      console.log("✅ JWT TOKEN:", token);

      // Save Token
      localStorage.setItem("token", token);

      // Save User Data
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Auth Context Login
      login(token);

      alert("Login Successful");

      // Navigate Dashboard
      navigate("/Dashboard");

    } catch (err) {

      console.log(err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Invalid Email or Password");
      }
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        {/* Heading */}
        <h1 style={styles.hello}>Hello there,</h1>

        <h2 style={styles.welcome}>Welcome!</h2>

        <form onSubmit={handleLogin}>

          {/* Email */}
          <div style={styles.inputBox}>

            <span style={styles.icon}>
              <img
                src={MailIcon}
                alt="mail"
                style={styles.inputIcon}
              />
            </span>

            <input
              type="email"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Email"
              style={styles.input}
            />

          </div>

          {/* Password */}
          <div style={styles.inputBox}>

            <span style={styles.icon}>🔒</span>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
              style={styles.input}
            />

            <span
              style={styles.eye}
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              <img
                src={
                  showPassword
                    ? eyeImg
                    : eyeOff
                }
                alt="toggle password"
                style={styles.eyeIcon}
              />
            </span>

          </div>

          {/* Remember + Forgot */}
          <div style={styles.options}>

            <label style={styles.remember}>
              <input type="checkbox" />
              Remember
            </label>

            <Link
              to="/ForgotPassword"
              style={styles.forgot}
            >
              Forgot Password?
            </Link>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            style={styles.button}
          >
            Login
          </button>

          {/* Signup */}
          <p style={styles.signupText}>

            Don't have an account?{" "}

            <Link
              to="/SignUp"
              style={styles.signupLink}
            >
              Sign Up
            </Link>

          </p>

        </form>

      </div>

    </div>
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
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.1)",
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
    color: "#1a005d",
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
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },

  eyeIcon: {
    width: "22px",
    height: "22px",
  },

  options: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "18px",
    fontSize: "14px",
  },

  remember: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  forgot: {
    color: "#1a005d",
    textDecoration: "none",
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

};