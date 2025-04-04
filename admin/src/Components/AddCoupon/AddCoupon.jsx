import React, { useState, useEffect } from 'react';
import './AddCoupon.css';
import { FaTrashAlt } from 'react-icons/fa'; // Import trash icon

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const AddCoupon = () => {
    const [couponDetails, setCouponDetails] = useState({
        promoCode: "",
        description: "",
        validTill: "",
        discount: ""
    });

    const [message, setMessage] = useState("");
    const [coupons, setCoupons] = useState([]);

    // 🔄 Handle Input Changes
    const changeHandler = (e) => {
        setCouponDetails({ ...couponDetails, [e.target.name]: e.target.value });
    };

    // 🚀 Handle API Request to Add Coupon
    const handleSubmit = async () => {
        if (!couponDetails.promoCode || !couponDetails.validTill || !couponDetails.discount) {
            setMessage("❌ All fields except description are required!");
            return;
        }

        const couponData = {
            name: couponDetails.promoCode.toUpperCase(),
            description: couponDetails.description,
            expiry: couponDetails.validTill,
            discount: parseFloat(couponDetails.discount)
        };

        try {
            const response = await fetch(`${API_BASE_URL}/addcoupon`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(couponData),
            });

            const data = await response.json();

            if (data.success) {
                setMessage("✅ Coupon added successfully!");
                setCouponDetails({
                    promoCode: "",
                    description: "",
                    validTill: "",
                    discount: ""
                });
                fetchCoupons(); // Refresh the coupon list after adding
            } else {
                setMessage(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error('Error adding coupon:', error);
            setMessage("❌ Failed to add coupon. Please try again.");
        }
    };

    // 📚 Fetch All Coupons
    const fetchCoupons = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/getallcoupons`);
            const data = await response.json();

            if (data.success) {
                setCoupons(data.coupons);
            } else {
                console.error("❌ Failed to fetch coupons.");
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
        }
    };

    // 🗑️ Handle Delete Coupon
    const deleteCoupon = async (name) => {
        try {
            const response = await fetch(`${API_BASE_URL}/deletecoupon`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name.toUpperCase() }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage("✅ Coupon deleted successfully!");
                fetchCoupons(); // Refresh coupons after deletion
            } else {
                setMessage(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error('Error deleting coupon:', error);
            setMessage("❌ Failed to delete coupon. Please try again.");
        }
    };

    // ⏬ Fetch Coupons on Component Load
    useEffect(() => {
        fetchCoupons();
    }, []);

    return (
        <div className="add-coupon-container">
            {/* Left Section: Add Coupon */}
            <div className="add-coupon-form">
                <h2>➕ Add Coupon</h2>

                <div className="addcoupon-itemfield">
                    <p>Promo Code (CAPS ONLY)</p>
                    <input
                        value={couponDetails.promoCode}
                        onChange={changeHandler}
                        type="text"
                        name="promoCode"
                        placeholder="Enter promo code"
                        style={{ textTransform: 'uppercase' }}
                    />
                </div>

                <div className="addcoupon-itemfield">
                    <p>Description</p>
                    <textarea
                        value={couponDetails.description}
                        onChange={changeHandler}
                        name="description"
                        placeholder="Enter description for the coupon"
                        rows="3"
                    />
                </div>

                <div className="addcoupon-itemfield">
                    <p>Valid Till</p>
                    <input
                        value={couponDetails.validTill}
                        onChange={changeHandler}
                        type="date"
                        name="validTill"
                    />
                </div>

                <div className="addcoupon-itemfield">
                    <p>Discount Amount</p>
                    <input
                        value={couponDetails.discount}
                        onChange={changeHandler}
                        type="number"
                        name="discount"
                        placeholder="Enter discount amount"
                    />
                </div>

                <button className="addcoupon-btn" onClick={handleSubmit}>Add Coupon</button>

                {message && <p className="addcoupon-message">{message}</p>}
            </div>

            {/* Right Section: All Coupons */}
            <div className="all-coupons">
                <h2>📚 All Coupons</h2>
                {coupons.length > 0 ? (
                    <table className="coupon-table">
                        <thead>
                            <tr>
                                <th>Promo Code</th>
                                <th>Description</th>
                                <th>Valid Till</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((coupon) => (
                                <tr key={coupon._id}>
                                    <td>{coupon.name}</td>
                                    <td>{coupon.description || "N/A"}</td>
                                    <td>{new Date(coupon.expiry).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteCoupon(coupon.name)}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-coupons">No coupons found. Add some coupons! 🎁</p>
                )}
            </div>
        </div>
    );
};

export default AddCoupon;
