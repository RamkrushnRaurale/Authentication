import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import LogoImg from "../Assets/Images/images.png";
import searchImg from "../Assets/Images/search.jpg";

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
    // Inline Cart Page toggle
    const [showCart, setShowCart] = useState(false);
    // Profile Dropdown Menu
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Close mobile drawer on resize to desktop
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

    // ----- Totals -----
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

                        {/* Cart Icon */}
                        <div className="cart-wrap">
                            <button
                                className="cart-button"
                                onClick={() => setShowCart((prev) => !prev)}
                                aria-label="Cart"
                            >
                                <i className="fas fa-shopping-cart"></i>
                            </button>
                            {count > 0 && <span className="msg">{count}</span>}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="profile-menu-container">
                            <div
                                className="profile-trigger"
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                            >
                                <div className="avatar-circle">
                                    <i className="fas fa-user"></i>
                                </div>
                                <span
                                    className={`arrow ${showProfileMenu ? "open" : ""}`}
                                >
                                    ^
                                </span>
                            </div>

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
                    </div>
                </nav>

                {/* ================= CONTENT ================= */}
                <div className="content-area">
                    {showCart ? (
                        /* ===== INLINE CART PAGE ===== */
                        <div className="cart-page">
                            <div className="cart-page-header">
                                <h2>
                                    My Cart ({count} {count === 1 ? "item" : "items"})
                                </h2>
                                <button
                                    className="cart-back-btn"
                                    onClick={() => setShowCart(false)}
                                >
                                    <i className="fas fa-arrow-left"></i> Continue Shopping
                                </button>
                            </div>

                            {carts.length === 0 ? (
                                <div className="cart-empty-state">
                                    <i className="fas fa-shopping-cart"></i>
                                    <h3>Your cart is empty</h3>
                                    <p>Add items to it now.</p>
                                    <button
                                        className="shop-now-btn"
                                        onClick={() => setShowCart(false)}
                                    >
                                        Shop Now
                                    </button>
                                </div>
                            ) : (
                                <div className="cart-page-layout">
                                    {/* LEFT: Cart Items */}
                                    <div className="cart-items-column">
                                        {carts.map((item) => (
                                            <div
                                                className="cart-item-card"
                                                key={item.productId}
                                            >
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    className="cart-item-img"
                                                />
                                                <div className="cart-item-details">
                                                    <h4 className="cart-item-title">
                                                        {item.title}
                                                    </h4>
                                                    <p className="cart-item-seller">
                                                        Seller: CodeRama Retail
                                                    </p>
                                                    <div className="cart-item-price-row">
                                                        <span className="cart-item-price">
                                                            ₹
                                                            {item.price.toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </span>
                                                        <span className="cart-item-mrp">
                                                            ₹
                                                            {Math.floor(
                                                                item.price * 1.25
                                                            ).toLocaleString("en-IN")}
                                                        </span>
                                                        <span className="cart-item-discount">
                                                            20% off
                                                        </span>
                                                    </div>
                                                    <p className="cart-item-delivery">
                                                        <i className="fas fa-truck"></i>{" "}
                                                        Delivery by{" "}
                                                        {new Date(
                                                            Date.now() + 3 * 86400000
                                                        ).toLocaleDateString("en-IN", {
                                                            weekday: "short",
                                                            day: "numeric",
                                                            month: "short",
                                                        })}
                                                    </p>
                                                    <div className="cart-item-actions">
                                                        <div className="qty-box">
                                                            <button
                                                                onClick={() =>
                                                                    dispatch(
                                                                        decreamentCart({
                                                                            productId:
                                                                                item.productId,
                                                                            quantity: 1,
                                                                        })
                                                                    )
                                                                }
                                                            >
                                                                −
                                                            </button>
                                                            <span>{item.quantity}</span>
                                                            <button
                                                                onClick={() =>
                                                                    dispatch(
                                                                        increamentCart({
                                                                            productId:
                                                                                item.productId,
                                                                            quantity: 1,
                                                                            title: item.title,
                                                                            price: item.price,
                                                                            thumbnail:
                                                                                item.thumbnail,
                                                                        })
                                                                    )
                                                                }
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <button
                                                            className="remove-btn"
                                                            onClick={() =>
                                                                dispatch(
                                                                    decreamentCart({
                                                                        productId:
                                                                            item.productId,
                                                                        quantity:
                                                                            item.quantity,
                                                                    })
                                                                )
                                                            }
                                                        >
                                                            <i className="far fa-trash-alt"></i>{" "}
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="cart-item-subtotal">
                                                    ₹
                                                    {(
                                                        item.price * item.quantity
                                                    ).toLocaleString("en-IN")}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Sticky checkout bar (mobile only) */}
                                        <div className="cart-checkout-sticky">
                                            <div className="sticky-total">
                                                <span>Total</span>
                                                <strong>
                                                    ₹
                                                    {finalAmount.toLocaleString("en-IN")}
                                                </strong>
                                            </div>
                                            <button className="place-order-btn">
                                                Place Order
                                            </button>
                                        </div>
                                    </div>

                                    {/* RIGHT: Price Details */}
                                    <aside className="price-details-card">
                                        <h3 className="price-details-title">
                                            PRICE DETAILS
                                        </h3>
                                        <div className="price-row">
                                            <span>Price ({count} items)</span>
                                            <span>
                                                ₹{totalPrice.toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                        <div className="price-row green">
                                            <span>Discount</span>
                                            <span>
                                                − ₹{discount.toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                        <div className="price-row">
                                            <span>Platform Fee</span>
                                            <span>₹{platformFee}</span>
                                        </div>
                                        <div className="price-row">
                                            <span>Delivery Charges</span>
                                            <span className="free">FREE</span>
                                        </div>
                                        <hr />
                                        <div className="price-row total">
                                            <span>Total Amount</span>
                                            <span>
                                                ₹{finalAmount.toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                        <div className="save-box">
                                            🎉 You will save ₹
                                            {(discount - platformFee).toLocaleString(
                                                "en-IN"
                                            )}{" "}
                                            on this order
                                        </div>
                                        <button className="place-order-btn desktop-only">
                                            Place Order
                                        </button>
                                        <div className="trust-badge">
                                            <i className="fas fa-shield-alt"></i> Safe and
                                            Secure Payments
                                        </div>
                                    </aside>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ===== DEFAULT CONTENT ===== */
                        <div className="scroll-area">
                            <Slider />
                            <Products />
                            <Footer />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SideBar;