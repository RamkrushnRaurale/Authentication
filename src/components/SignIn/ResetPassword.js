import React, { useState } from "react";
import {
    useParams,
    useNavigate,
} from "react-router-dom";

import api from "./Api";

export default function ResetPassword() {

    const { token } =
        useParams();

    const navigate =
        useNavigate();

    const [password, setPassword] =
        useState("");

    const [confirmPassword,
        setConfirmPassword] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            if (
                !password ||
                !confirmPassword
            ) {

                setMessage(
                    "All fields are required"
                );

                return;
            }

            if (
                password.length < 8
            ) {

                setMessage(
                    "Password must be at least 8 characters"
                );

                return;
            }

            if (
                password !==
                confirmPassword
            ) {

                setMessage(
                    "Passwords do not match"
                );

                return;
            }

            try {

                setLoading(true);

                const response =
                    await api.post(
                        `/reset-password/${token}`,
                        {
                            password,
                        }
                    );

                setMessage(
                    response.data.message
                );

                setTimeout(() => {

                    navigate(
                        "/SignIn"
                    );

                }, 2000);

            } catch (error) {

                console.log(error);

                setMessage(
                    error.response?.data?.message ||
                    "Something went wrong"
                );

            } finally {

                setLoading(false);

            }
        };

    return (

        <div style={styles.container}>

            <div style={styles.card}>

                <h2 style={styles.heading}>
                    Reset Password
                </h2>

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <input
                        type="password"
                        placeholder="Enter New Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        style={styles.input}
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(
                                e.target.value
                            )
                        }
                        style={styles.input}
                    />

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {
                            loading
                                ? "Updating..."
                                : "Reset Password"
                        }
                    </button>

                </form>

                {
                    message &&

                    <p style={styles.message}>
                        {message}
                    </p>
                }

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
        marginBottom: "20px",
        color: "#14004d",
    },

    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        outline: "none",
        boxSizing: "border-box",
    },

    button: {
        width: "100%",
        padding: "12px",
        border: "none",
        borderRadius: "5px",
        background: "#14004d",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
    },

    message: {
        marginTop: "15px",
        color: "#28a745",
        fontWeight: "bold",
    },
};