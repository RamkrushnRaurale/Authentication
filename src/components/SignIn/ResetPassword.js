import React, { useState } from "react";
import axios from "axios";
import {
    useParams,
    useNavigate
} from "react-router-dom";

export default function ResetPassword() {

    const { token } = useParams();

    const navigate = useNavigate();

    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                `http://localhost:5000/reset-password/${token}`,
                { password }
            );

            setMessage(response.data.message);

            setTimeout(() => {

                navigate("/SignIn");

            }, 2000);

        } catch (error) {

            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    return (

        <div style={styles.container}>

            <div style={styles.card}>

                <h2 style={styles.heading}>
                    Reset Password
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="password"
                        placeholder="Enter New Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        style={styles.input}
                    />

                    <button
                        type="submit"
                        style={styles.button}
                    >
                        Reset Password
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
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        textAlign: "center",
    },

    heading: {
        marginBottom: "20px",
        color: "#14004d",
    },

    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "20px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        outline: "none",
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
    },
};