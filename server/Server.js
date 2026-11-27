require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

/* ================= FILE-BASED USER STORE (no MySQL) ================= */

const DB_FILE = path.join(__dirname, "users.json");

const loadUsers = () => {
  try {
    if (!fs.existsSync(DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch (err) {
    console.log("❌ USER STORE LOAD ERROR:", err.message);
    return [];
  }
};

const saveUsers = (users) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), "utf8");
  } catch (err) {
    console.log("❌ USER STORE SAVE ERROR:", err.message);
  }
};

let users = loadUsers();
let nextId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;

console.log(`✅ USER STORE READY (${users.length} users)`);

/* ================= TEST ROUTE ================= */

app.get("/", (req, res) => {
  res.send("✅ Backend Running");
});

/* ================= NODEMAILER ================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= HELPERS ================= */

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/* ================= AUTH MIDDLEWARE ================= */

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access Token Missing",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid or Expired Access Token",
      });
    }

    req.user = decoded;
    next();
  });
};

/* ================= SIGNUP ================= */

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, Email and Password are required",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid Email Format",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: nextId++,
      username,
      email,
      password: hashedPassword,
    };

    users.push(newUser);
    saveUsers(users);

    res.status(201).json({
      message: "Signup Successful",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      accessToken,
      refreshToken,

      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },

      message: "Login Successful",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* ================= REFRESH TOKEN ================= */

app.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh Token Missing",
      });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid or Expired Refresh Token",
        });
      }

      const accessToken = jwt.sign(
        {
          id: decoded.id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "15m",
        }
      );

      res.status(200).json({
        accessToken,
      });
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* ================= PROFILE ================= */

app.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = users.find((u) => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* ================= FORGOT PASSWORD ================= */

app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(404).json({
        message: "Email Not Found",
      });
    }

    const token = jwt.sign({ email }, process.env.RESET_SECRET, {
      expiresIn: "15m",
    });

    /* NOTE: removed "/Authentication" prefix so it matches the
       React router path used by your ResetPassword component */
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: email,

      subject: "Reset Password",

      html: `
        <h2>Password Reset</h2>

        <p>
          Click below link
          to reset password:
        </p>

        <a href="${resetLink}">
          Reset Password
        </a>
      `,
    });

    res.status(200).json({
      message: "Reset Password Link Sent Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Email Send Failed",
    });
  }
});

/* ================= RESET PASSWORD ================= */

app.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password Required",
      });
    }

    const decoded = jwt.verify(token, process.env.RESET_SECRET);

    const user = users.find((u) => u.email === decoded.email);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    saveUsers(users);

    res.status(200).json({
      message: "Password Reset Successful",
    });
  } catch (error) {
    console.log(error);

    res.status(401).json({
      message: "Invalid or Expired Token",
    });
  }
});

/* ================= SERVER ================= */

app.listen(process.env.PORT, () => {
  console.log(`✅ SERVER RUNNING ON PORT ${process.env.PORT}`);
});