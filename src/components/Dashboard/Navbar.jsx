import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import images from "../Assets/Images/images.png"; 
import "./Navbar.css";

export default function Navbar() {
    const [text, setText] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Searching for:", text);
    };

    return (
        <>
            <nav className="custom-navbar">
                <div className="navbar-container">
                    
                    {/* LEFT: Hamburger (Mobile) / Logo (Desktop) */}
                    <div className="navbar-left">
                        <button 
                            className="menu-toggle-btn d-lg-none" 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <i className="bi bi-list"></i>
                        </button>
                        
                        <Link className="navbar-brand d-none d-lg-block" to="/">
                            <img className="navbar-logo" src={images} alt="logo" />
                        </Link>
                    </div>

                    {/* CENTER: Search Bar */}
                    <div className="navbar-center">
                        <form className="search-form" onSubmit={handleSearchSubmit}>
                            <input
                                className="search-input"
                                type="search"
                                placeholder="Search"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                aria-label="Search"
                            />
                            <button className="search-icon-btn" type="submit">
                                <i className="bi bi-search"></i>
                            </button>
                        </form>
                    </div>

                    {/* RIGHT: Cart & Logout */}
                    <div className="navbar-right">
                        <Link to="/cart" className="cart-icon-wrapper">
                            <div className="cart-circle">
                                <i className="bi bi-cart3"></i>
                            </div>
                            <span className="cart-badge">6</span>
                        </Link>

                        <Link to="/SignIn" className="logout-btn">
                            <span className="d-none d-lg-block px-2">LogOut</span>
                        </Link>
                    </div>

                </div>

                {/* MOBILE DROPDOWN MENU */}
                {isMenuOpen && (
                    <div className="mobile-menu-dropdown d-lg-none">
                        <Link to="/" className="mobile-link">Home</Link>
                        <Link to="/profile" className="mobile-link">Profile</Link>
                        <Link to="/SignIn" className="mobile-link text-danger">LogOut</Link>
                    </div>
                )}
            </nav>

            <div className="navbar-spacer"></div>
        </>
    );
}