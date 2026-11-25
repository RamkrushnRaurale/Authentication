import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import LogoImg from "../Assets/Images/images.png";
import searchImg from "../Assets/Images/search.jpg";
import cartimg from "../Assets/Images/ShppingCart.png";

import "./SideBar.css";

import Footer from "./Footer";
import Slider from "./Slider";
import Products from "../Products/Products";

import { useSelector, useDispatch } from "react-redux";
import { increamentCart, decreamentCart } from "../cart/cartSlice";
import { useAuth } from "../SignIn/AuthContext";

function SideBar() {
    const carts = useSelector((store) => store.cart.item);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Sidebar (desktop collapse)
    const [collapsed, setCollapsed] = useState(false);
    // Sidebar (mobile drawer open/close)
    const [mobileOpen, setMobileOpen] = useState(false);
    // Cart Popup
    const [showCart, setShowCart] = useState(false);
    // Profile Dropdown Menu
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Close mobile drawer on route change / resize to desktop
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 768) setMobileOpen(false);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // Lock body scroll when mobile drawer is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    const handleToggleSidebar = () => {
        // On mobile → toggle drawer. On desktop → toggle collapse.
        if (window.innerWidth <= 768) {
            setMobileOpen((prev) => !prev);
        } else {
            setCollapsed((prev) => !prev);
        }
    };

    const closeMobileDrawer = () => setMobileOpen(false);

    const handleLogout = () => {
        logout();
        navigate("/SignIn");
    };

    // Totals
    const count = useMemo(
        () => carts.reduce((acc, curr) => acc + curr.quantity, 0),
        [carts]
    );

    const totalPrice = useMemo(
        () => carts.reduce((acc, item) => acc + item.price * item.quantity, 0),
        [carts]
    );

    const discount = useMemo(() => Math.floor(totalPrice * 0.2), [totalPrice]);
    const platformFee = 11;
    const finalAmount = totalPrice - discount + platformFee;

    return (
        <div className="wrapper fixed-top">
            {/* Mobile backdrop */}
            <div
                className={`sidebar-backdrop ${mobileOpen ? "show" : ""}`}
                onClick={closeMobileDrawer}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <aside
                id="sidebar"
                className={[
                    collapsed ? "collapsed" : "",
                    mobileOpen ? "mobile-open" : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                <ul className="sidebar-nav">
                    <li className="sidebar-item">
                        <Link className="sidebar-link" to="//" onClick={closeMobileDrawer}>
                            <img src={LogoImg} alt="Logo" className="sidebar-logo" />
                            <span className="sidebar-text">CodeRama</span>
                        </Link>
                    </li>

                    <li className="sidebar-item">
                        <Link
                            className="sidebar-link"
                            to="/Dashboard"
                            onClick={closeMobileDrawer}
                        >
                            <i className="fas fa-home"></i>
                            <span className="sidebar-text">Home</span>
                        </Link>
                    </li>

                    <li className="sidebar-item">
                        <Link className="sidebar-link" to="//" onClick={closeMobileDrawer}>
                            <i className="fas fa-user-circle"></i>
                            <span className="sidebar-text">About Us</span>
                        </Link>
                    </li>

                    <li className="sidebar-item">
                        <Link className="sidebar-link" to="//" onClick={closeMobileDrawer}>
                            <i className="fas fa-phone-alt"></i>
                            <span className="sidebar-text">Contact</span>
                        </Link>
                    </li>

                    <li className="sidebar-item">
                        <Link className="sidebar-link" to="//" onClick={closeMobileDrawer}>
                            <i className="fas fa-cog"></i>
                            <span className="sidebar-text">Services</span>
                        </Link>
                    </li>

                    <li className="sidebar-item">
                        <Link className="sidebar-link" to="//" onClick={closeMobileDrawer}>
                            <i className="fas fa-question-circle"></i>
                            <span className="sidebar-text">FAQs</span>
                        </Link>
                    </li>
                </ul>
            </aside>

            {/* Main */}
            <div className="main">
                {/* Navbar */}
                <nav className="navbar navbar-light px-3 border-bottom d-flex justify-content-between align-items-center">
                    <button
                        style={{ outline: "none" }}
                        className="btn menu-btn"
                        onClick={handleToggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        ☰
                    </button>

                    <div className="d-flex align-items-center ms-auto nav-actions">
                        {/* Search */}
                        <div className="nav-search me-3">
                            <div className="search-wrap">
                                <div className="search-input">
                                    <img
                                        src={searchImg}
                                        alt="Search"
                                        className="search-icon"
                                    />
                                    <input type="search" placeholder="Search..." />
                                </div>
                            </div>
                        </div>

                        {/* Cart */}

                        <div className="cart-wrap">
                            <button
                                className="cart-button"
                                onClick={() => setShowCart(!showCart)}
                                aria-label="Cart"
                            >
                                <i className="fas fa-shopping-cart"></i>
                            </button>
                            {count > 0 && <span className="msg">{count}</span>}
                        </div>

                        {/* ===== UPDATED LOGOUT DROPDOWN ===== */}
                        <div className="profile-menu-container">
                            {/* Trigger Button (Red Circle) */}
                            <div
                                className="profile-trigger"
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                            >
                                <div className="avatar-circle">
                                    <i className="fas fa-user"></i>
                                </div>
                                <span className={`arrow ${showProfileMenu ? 'open' : ''}`}>^</span>
                            </div>

                            {/* Dropdown Menu */}
                            {showProfileMenu && (
                                <div className="dropdown-menu-custom">
                                    <ul className="menu-list">
                                        <li className="menu-item">
                                            <i className="far fa-user"></i> My Profile
                                        </li>
                                        <li className="menu-item">
                                            <i className="fas fa-tachometer-alt"></i> Dashboard
                                        </li>
                                        <li className="menu-item">
                                            <i className="fas fa-cog"></i> Settings
                                        </li>
                                    </ul>

                                    <hr className="divider" />

                                    {/* THE ACTUAL LOGOUT BUTTON */}
                                    <button
                                        className="logout-action"
                                        onClick={handleLogout}
                                    >
                                        <i className="fas fa-sign-out-alt"></i>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* ===== END LOGOUT DROPDOWN ===== */}

                    </div>
                </nav>

                {/* Cart Popup */}
                {showCart && (
                    <div className="cart-container">
                        <div className="cart-header">
                            <h2>My Cart</h2>
                            <button
                                className="cart-close"
                                onClick={() => setShowCart(false)}
                                aria-label="Close cart"
                            >
                                ×
                            </button>
                        </div>

                        {carts.length === 0 ? (
                            <p>Cart Empty</p>
                        ) : (
                            <>
                                {carts.map((item) => (
                                    <div className="cart-item" key={item.productId}>
                                        <img src={item.thumbnail} alt="" />
                                        <div className="cart-info">
                                            <h4>{item.title}</h4>
                                            <p>₹ {item.price}</p>
                                            <div className="qty-box">
                                                <button
                                                    onClick={() =>
                                                        dispatch(
                                                            decreamentCart({
                                                                productId: item.productId,
                                                                quantity: 1,
                                                            })
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() =>
                                                        dispatch(
                                                            increamentCart({
                                                                productId: item.productId,
                                                                quantity: 1,
                                                                title: item.title,
                                                                price: item.price,
                                                                thumbnail: item.thumbnail,
                                                            })
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="price-details">
                                    <h3>Price Details</h3>
                                    <div className="price-row">
                                        <span>Price ({count} items)</span>
                                        <span>₹ {totalPrice}</span>
                                    </div>
                                    <div className="price-row green">
                                        <span>Discount</span>
                                        <span>- ₹ {discount}</span>
                                    </div>
                                    <div className="price-row">
                                        <span>Platform Fee</span>
                                        <span>₹ {platformFee}</span>
                                    </div>
                                    <hr />
                                    <div className="price-row total">
                                        <span>Total Amount</span>
                                        <span>₹ {finalAmount}</span>
                                    </div>
                                    <div className="save-box">
                                        🎉 You'll save ₹{discount - platformFee} on this
                                        order!
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="content-area">
                    <div className="scroll-area">
                        <Slider />
                        <Products />
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SideBar;