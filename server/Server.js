require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use(express.json());

/* ================= MYSQL POOL ================= */

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

/* ================= TEST DB CONNECTION ================= */

(async () => {
    try {
        const connection = await db.getConnection();
        console.log("✅ MYSQL CONNECTED");
        connection.release();
    } catch (error) {
        console.log("❌ MYSQL ERROR:", error.message);
    }
})();

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

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Invalid or Expired Access Token",
                });
            }

            req.user = decoded;
            next();
        }
    );
};

/* ================= SIGNUP ================= */

app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } =
            req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message:
                    "Username, Email and Password are required",
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                message: "Invalid Email Format",
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters",
            });
        }

        const [existingUser] =
            await db.execute(
                "SELECT id FROM users WHERE email=?",
                [email]
            );

        if (existingUser.length > 0) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        await db.execute(
            `
            INSERT INTO users
            (username,email,password)
            VALUES(?,?,?)
            `,
            [
                username,
                email,
                hashedPassword,
            ]
        );

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

        const { email, password } =
            req.body;

        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and Password are required",
            });
        }

        const [users] =
            await db.execute(
                "SELECT * FROM users WHERE email=?",
                [email]
            );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const user = users[0];

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
            return res.status(401).json({
                message:
                    "Invalid Email or Password",
            });
        }

        const accessToken =
            generateAccessToken(user);

        const refreshToken =
            generateRefreshToken(user);

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

app.post(
    "/refresh-token",
    async (req, res) => {

        try {

            const { refreshToken } =
                req.body;

            if (!refreshToken) {
                return res.status(401).json({
                    message:
                        "Refresh Token Missing",
                });
            }

            jwt.verify(
                refreshToken,
                process.env.REFRESH_SECRET,

                (err, decoded) => {

                    if (err) {
                        return res.status(403).json({
                            message:
                                "Invalid or Expired Refresh Token",
                        });
                    }

                    const accessToken =
                        jwt.sign(
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
                }
            );

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: "Server Error",
            });
        }
    }
);

/* ================= PROFILE ================= */

app.get(
    "/profile",
    verifyToken,
    async (req, res) => {

        try {

            const [users] =
                await db.execute(
                    `
                    SELECT
                    id,
                    username,
                    email
                    FROM users
                    WHERE id=?
                    `,
                    [req.user.id]
                );

            if (users.length === 0) {
                return res.status(404).json({
                    message: "User Not Found",
                });
            }

            res.status(200).json(
                users[0]
            );

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: "Server Error",
            });
        }
    }
);

/* ================= FORGOT PASSWORD ================= */

app.post(
    "/forgot-password",
    async (req, res) => {

        try {

            const { email } =
                req.body;

            if (!email) {
                return res.status(400).json({
                    message:
                        "Email is required",
                });
            }

            const [users] =
                await db.execute(
                    "SELECT email FROM users WHERE email=?",
                    [email]
                );

            if (users.length === 0) {
                return res.status(404).json({
                    message:
                        "Email Not Found",
                });
            }

            const token =
                jwt.sign(
                    { email },
                    process.env.RESET_SECRET,
                    {
                        expiresIn: "15m",
                    }
                );

            const resetLink =
                `${process.env.FRONTEND_URL}/Authentication/reset-password/${token}`;

            await transporter.sendMail({
                from:
                    process.env.EMAIL_USER,

                to: email,

                subject:
                    "Reset Password",

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
                message:
                    "Reset Password Link Sent Successfully",
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Email Send Failed",
            });
        }
    }
);

/* ================= RESET PASSWORD ================= */

app.post(
    "/reset-password/:token",
    async (req, res) => {

        try {

            const { token } =
                req.params;

            const { password } =
                req.body;

            if (!password) {
                return res.status(400).json({
                    message:
                        "Password Required",
                });
            }

            const decoded =
                jwt.verify(
                    token,
                    process.env.RESET_SECRET
                );

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );

            await db.execute(
                `
                UPDATE users
                SET password=?
                WHERE email=?
                `,
                [
                    hashedPassword,
                    decoded.email,
                ]
            );

            res.status(200).json({
                message:
                    "Password Reset Successful",
            });

        } catch (error) {

            console.log(error);

            res.status(401).json({
                message:
                    "Invalid or Expired Token",
            });
        }
    }
);

/* ================= SERVER ================= */

app.listen(
    process.env.PORT,
    () => {
        console.log(
            `✅ SERVER RUNNING ON PORT ${process.env.PORT}`
        );
    }
);