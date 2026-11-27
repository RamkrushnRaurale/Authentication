import React, { useEffect, useState, useMemo } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { increamentCart, decreamentCart } from "../cart/cartSlice";

const Products = () => {
    const carts = useSelector((store) => store.cart.item);
    const dispatch = useDispatch();
    const [productsByCategory, setProductsByCategory] = useState({});

    // Fast lookup for cart quantities
    const cartLookup = useMemo(() => {
        const map = {};
        carts.forEach((item) => {
            map[item.productId] = item.quantity;
        });
        return map;
    }, [carts]);

    // Group Products by Category
    const groupByCategory = (arr) => {
        const grouped = {};
        arr.forEach((product) => {
            if (!grouped[product.category]) {
                grouped[product.category] = [];
            }
            grouped[product.category].push(product);
        });
        return grouped;
    };

    // Fetch API
    const fetchData = async () => {
        try {
            const response = await fetch("https://dummyjson.com/products");
            const data = await response.json();
            const grouped = groupByCategory(data.products);
            setProductsByCategory(grouped);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container">
            {Object.entries(productsByCategory).map(([categoryName, products]) => (
                <div className="category-block" key={categoryName}>
                    <h1 className="category-title">
                        {categoryName.replace("-", " ")}
                    </h1>

                    <div className="category-group">
                        {products.map((product) => {
                            const count = cartLookup[product.id] || 0;
                            // Calculate a fake MRP and discount for the UI
                            const mrp = Math.floor(product.price * 1.5); 
                            const discountPercent = Math.round(((mrp - product.price) / mrp) * 100);

                            return (
                                <div className="card" key={product.id}>
                                    {/* Image Area */}
                                    <div className="image-wrap">
                                        <img
                                            className="card-image"
                                            src={product.thumbnail}
                                            alt={product.title}
                                        />
                                    </div>

                                    {/* Details Area */}
                                    <div className="card-details">
                                        <div className="title">
                                            <h4>{product.title}</h4>
                                        </div>

                                        <div className="price-row">
                                            <span className="price">
                                                ₹{product.price.toLocaleString("en-IN")}
                                            </span>
                                            <span className="mrp">
                                                M.R.P: ₹{mrp.toLocaleString("en-IN")}
                                            </span>
                                        </div>

                                        {/* Deal Badges (Like Flipkart Screenshot) */}
                                        <div className="deal-row">
                                            <span className="discount-badge">
                                                {discountPercent}% off
                                            </span>
                                            <span className="deal-text">Limited time deal</span>
                                        </div>
                                    </div>

                                    {/* ACTION ROW: Swaps between Add Button and Quantity Box */}
                                    <div className="card-action-row">
                                        {count > 0 ? (
                                            <div className="qty-box">
                                                <button
                                                    className="qty-box-btn"
                                                    onClick={() =>
                                                        dispatch(
                                                            decreamentCart({
                                                                productId: product.id,
                                                                quantity: 1,
                                                            })
                                                        )
                                                    }
                                                >
                                                    −
                                                </button>

                                                <span>{count}</span>

                                                <button
                                                    className="qty-box-btn"
                                                    onClick={() =>
                                                        dispatch(
                                                            increamentCart({
                                                                productId: product.id,
                                                                quantity: 1,
                                                                title: product.title,
                                                                price: product.price,
                                                                thumbnail: product.thumbnail,
                                                            })
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="add-btn"
                                                onClick={() =>
                                                    dispatch(
                                                        increamentCart({
                                                            productId: product.id,
                                                            quantity: 1,
                                                            title: product.title,
                                                            price: product.price,
                                                            thumbnail: product.thumbnail,
                                                        })
                                                    )
                                                }
                                            >
                                                Add To Cart
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Products;