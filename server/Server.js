require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();


// ================= MIDDLEWARE =================

app.use(cors());
app.use(express.json());


// ================= TEST ROUTE =================

app.get("/", (req, res) => {

    res.send("✅ Backend Running");

});


// ================= MYSQL CONNECTION =================

const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "Rama@1998",
    database: "auth_db",

});

db.connect((err) => {

    if (err) {

        console.log("❌ MYSQL ERROR:", err);

    } else {

        console.log("✅ MYSQL CONNECTED");

    }
});


// ================= CHECK ENV =================

console.log("EMAIL USER:", process.env.EMAIL_USER);
console.log("EMAIL PASS:", process.env.EMAIL_PASS);


// ================= NODEMAILER =================

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,

    },

    tls: {

        rejectUnauthorized: false,

    },
});


// ================= SIGNUP =================

app.post("/signup", async (req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;

        if (!username || !email || !password) {

            return res.status(400).json({

                message: "All fields are required",

            });
        }

        const checkSql =
            "SELECT * FROM users WHERE email=?";

        db.query(checkSql, [email], async (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    message: "Database Error",

                });
            }

            if (result.length > 0) {

                return res.status(400).json({

                    message: "Email already exists",

                });
            }

            const hashedPassword =
                await bcrypt.hash(password, 10);

            const sql =
                "INSERT INTO users(username,email,password) VALUES(?,?,?)";

            db.query(
                sql,
                [
                    username,
                    email,
                    hashedPassword
                ],
                (err, result) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({

                            message: "Signup Failed",

                        });
                    }

                    res.status(200).json({

                        message: "Signup Successful",

                    });
                }
            );
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error",

        });
    }
});


// ================= LOGIN =================

app.post("/login", (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                message: "All fields are required",

            });
        }

        const sql =
            "SELECT * FROM users WHERE email=?";

        db.query(sql, [email], async (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    message: "Database Error",

                });
            }

            if (result.length === 0) {

                return res.status(404).json({

                    message: "User not found",

                });
            }

            const user = result[0];

            const match =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!match) {

                return res.status(401).json({

                    message: "Wrong Password",

                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                },
                "secretkey",
                {
                    expiresIn: "1d",
                }
            );

            res.status(200).json({

                token,
                user,
                message: "Login Successful",

            });
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error",

        });
    }
});


// ================= FORGOT PASSWORD =================

app.post("/forgot-password", (req, res) => {

    try {

        const { email } = req.body;

        console.log("📧 EMAIL:", email);

        if (!email) {

            return res.status(400).json({

                message: "Email is required",

            });
        }

        const sql =
            "SELECT * FROM users WHERE email=?";

        db.query(sql, [email], (err, result) => {

            if (err) {

                console.log("DATABASE ERROR:", err);

                return res.status(500).json({

                    message: "Database Error",

                });
            }

            if (result.length === 0) {

                return res.status(404).json({

                    message: "Email Not Found",

                });
            }

            const token = jwt.sign(
                { email },
                "resetSecretKey",
                { expiresIn: "15m" }
            );

            // IMPORTANT FIX
            const resetLink =
                `http://localhost:3000/Authentication/reset-password/${token}`;

            console.log("RESET LINK:", resetLink);

            const mailOptions = {

                from: process.env.EMAIL_USER,

                to: email,

                subject: "Reset Password",

                html: `
                    <h2>Password Reset</h2>

                    <p>
                        Click below link to reset password:
                    </p>

                    <a href="${resetLink}">
                        Reset Password
                    </a>
                `,
            };

            transporter.sendMail(
                mailOptions,
                (error, info) => {

                    if (error) {

                        console.log(
                            "❌ MAIL ERROR:",
                            error.message
                        );

                        return res.status(500).json({

                            message: "Email Send Failed",

                        });
                    }

                    console.log("✅ EMAIL SENT");

                    res.status(200).json({

                        message:
                            "Reset password link sent successfully",

                    });
                }
            );
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error",

        });
    }
});


// ================= RESET PASSWORD =================

app.post(
    "/reset-password/:token",
    async (req, res) => {

        try {

            const { token } = req.params;

            const { password } = req.body;

            if (!password) {

                return res.status(400).json({

                    message: "Password is required",

                });
            }

            jwt.verify(
                token,
                "resetSecretKey",
                async (err, decoded) => {

                    if (err) {

                        return res.status(401).json({

                            message: "Invalid or Expired Token",

                        });
                    }

                    const hashedPassword =
                        await bcrypt.hash(password, 10);

                    const sql =
                        "UPDATE users SET password=? WHERE email=?";

                    db.query(
                        sql,
                        [
                            hashedPassword,
                            decoded.email,
                        ],
                        (err, result) => {

                            if (err) {

                                console.log(err);

                                return res.status(500).json({

                                    message: "Password Reset Failed",

                                });
                            }

                            res.status(200).json({

                                message:
                                    "Password Reset Successful",

                            });
                        }
                    );
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


// ================= SERVER =================

app.listen(5000, () => {

    console.log(
        "✅ SERVER RUNNING ON PORT 5000"
    );

});