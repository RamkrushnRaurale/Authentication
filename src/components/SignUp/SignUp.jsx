import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../SignIn/Api";

import "./SignUp.css";

function SignUp() {

    const [username, setUsername] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [nameErr, setNameErr] =
        useState(false);

    const navigate =
        useNavigate();

    const registration =
        async () => {

            if (
                !username.trim() ||
                !email.trim() ||
                !password.trim()
            ) {
                setNameErr(true);
                return;
            }

            setNameErr(false);

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailPattern.test(
                    email
                )
            ) {
                alert(
                    "Please enter a valid email"
                );
                return;
            }

            if (
                password.length < 8
            ) {
                alert(
                    "Password must be at least 8 characters"
                );
                return;
            }

            try {

                setLoading(true);

                await api.post(
                    "/signup",
                    {
                        username,
                        email,
                        password,
                    }
                );

                alert(
                    "Signup Successful"
                );

                setUsername("");
                setEmail("");
                setPassword("");

                navigate(
                    "/SignIn"
                );

            } catch (err) {

                console.log(err);

                alert(
                    err.response?.data
                        ?.message ||
                    "Signup Failed"
                );

            } finally {

                setLoading(false);

            }
        };

    return (

        <div className="register-body">

            <div className="register-main">

                <h1>
                    Sign Up
                </h1>

                {
                    nameErr && (
                        <p className="errP">
                            *Please fill all fields*
                        </p>
                    )
                }

                <p>Name</p>

                <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                        setUsername(
                            e.target.value
                        )
                    }
                    placeholder="Enter your name"
                />

                <p>Email</p>

                <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                    placeholder="Enter your email"
                />

                <p>Password</p>

                <div className="custom-password-container">
                    <span className="lock-icon">🔒</span>

                    <input
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        placeholder="Enter password"
                        className="password-input-field"
                    />

                    <button
                        type="button"
                        className="eye-icon-btn"
                        onClick={() =>
                            setShowPassword(
                                (prev) => !prev
                            )
                        }
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                        title={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showPassword ? (
                            /* EyeOff Icon (Crossed out / Hidden) */
                             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          
                        ) : (
                            /* Eye Icon (Open / Visible) */
                             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f53636" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        )}
                    </button>
                </div>

                <br />
                <br />

                <button
                    onClick={
                        registration
                    }
                    disabled={
                        loading
                    }
                    style={{
                        marginBottom:
                            "10px",
                    }}
                >
                    {
                        loading
                            ? "Creating Account..."
                            : "Sign Up"
                    }
                </button>

                <p
                    style={{
                        fontSize:
                            "15px",
                    }}
                >
                    Already have an account?{" "}

                    <Link to="/SignIn">
                        <b>
                            Sign In
                        </b>
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default SignUp;