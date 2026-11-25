import { useState } from "react";
import { Link } from "react-router-dom";

import MailIcon from "../Assets/Images/MailIcon.png";
import api from "./Api";

export default function ForgotPassword() {

    const [email, setEmail] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!email.trim()) {

            setMessage(
                "Email is required"
            );

            return;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailPattern.test(email)
        ) {

            setMessage(
                "Please enter a valid email"
            );

            return;
        }

        try {

            setLoading(true);

            const response =
                await api.post(
                    "/forgot-password",
                    { email }
                );

            setMessage(
                response.data.message
            );

            setEmail("");

        } catch (error) {

            console.log(error);

            setMessage(
                error.response?.data
                    ?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div style={styles.container}>

            <div style={styles.card}>

                <h1 style={styles.heading}>
                    Forgot Password
                </h1>

                <p style={styles.text}>
                    Enter your email address
                    to receive a password
                    reset link
                </p>

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <div
                        style={
                            styles.inputBox
                        }
                    >

                        <span
                            style={
                                styles.icon
                            }
                        >

                            <img
                                src={MailIcon}
                                alt="mail"
                                style={
                                    styles.inputIcon
                                }
                            />

                        </span>

                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target
                                        .value
                                )
                            }
                            style={
                                styles.input
                            }
                        />

                    </div>

                    <button
                        type="submit"
                        style={
                            styles.button
                        }
                        disabled={
                            loading
                        }
                    >
                        {
                            loading
                                ? "Sending..."
                                : "Send Reset Link"
                        }
                    </button>

                </form>

                {
                    message && (

                        <p
                            style={
                                styles.message
                            }
                        >
                            {message}
                        </p>

                    )
                }

                <div
                    style={{
                        marginTop:
                            "20px",
                    }}
                >

                    <Link
                        to="/SignIn"
                        style={
                            styles.back
                        }
                    >
                        ← Back To Login
                    </Link>

                </div>

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
        background: "#f5f5f5",
        fontFamily: "Arial",
    },

    card: {
        width: "350px",
        background: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow:
            "0 5px 15px rgba(0,0,0,0.1)",
        textAlign: "center",
    },

    heading: {
        color: "#14004d",
        marginBottom: "10px",
    },

    text: {
        color: "#555",
        fontSize: "14px",
        marginBottom: "20px",
    },

    inputBox: {
        display: "flex",
        alignItems: "center",
        background: "#eef0ff",
        borderRadius: "8px",
        padding: "12px",
    },

    icon: {
        marginRight: "10px",
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

    button: {
        width: "100%",
        marginTop: "20px",
        padding: "12px",
        border: "none",
        borderRadius: "6px",
        background: "#14004d",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
    },

    message: {
        marginTop: "15px",
        fontSize: "14px",
        color: "#28a745",
        fontWeight: "bold",
    },

    back: {
        textDecoration: "none",
        color: "#5a54ff",
        fontWeight: "bold",
    },
};