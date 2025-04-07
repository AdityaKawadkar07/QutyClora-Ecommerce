import React, { useContext, useEffect, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";
import remove_icon from "../assets/cart_cross_icon.png";
import { FaGift } from "react-icons/fa";

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

const CartItems = () => {
  const {
    getTotalCartAmount,
    all_product,
    cartItems,
    removeFromCart,
    saveDiscountDetails,
  } = useContext(ShopContext);
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponMessage, setCouponMessage] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(false);
  

  const navigate = useNavigate();

  // Fetch Coupons from API
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/getallcoupons`);
        const data = await response.json();
        if (data.success) {
          setAvailableCoupons(data.coupons);
        } else {
          setAvailableCoupons([]);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };
    fetchCoupons();
  }, []);

  const handleCheckout = () => {
    const hasItemsInCart = Object.values(cartItems).some(
      (quantity) => quantity > 0
    );
    if (!hasItemsInCart) {
      alert("No order selected");
    } else {
      navigate("/order");
    }
  };

  // Apply coupon on clicking from dialog
  // Select coupon but don't apply immediately
  const applyCoupon = (coupon) => {
    setSelectedCoupon(coupon); // Store selected coupon temporarily
    setPromoCode(coupon.name);
    setShowPromoDialog(false);
    setCouponMessage("");
  };

  useEffect(() => {
    const checkFirstTimeBuyer = async () => {
      const authToken = localStorage.getItem("auth-token");
      if (!authToken) return;

      try {
        const response = await fetch(`${API_BASE_URL}/getmyorders`, {
          method: "GET",
          headers: {
            "auth-token": `${authToken}`,
          },
        });

        const data = await response.json();
        if (
          data.success === false &&
          data.message === "No orders found for this user"
        ) {
          setIsFirstTimeBuyer(true); // Mark as first-time buyer
        } else if (data.success && data.orders.length === 0) {
          setIsFirstTimeBuyer(true); // Additional fallback (if empty orders array is returned)
        } else {
          setIsFirstTimeBuyer(false); // Orders exist or API failed
        }
      } catch (error) {
        console.error("Error checking first-time buyer status:", error);
      }
    };

    checkFirstTimeBuyer();
  }, []);

  // Special coupon for first-time buyers
  const firstTimeCoupon = {
    _id: "first-time-coupon",
    name: "WELCOME200",
    description:
      "Flat ₹200 off on orders above ₹500 or 30% off below ₹500 for first-time buyers t&c",
    type: "special",
  };

  // Add first-time coupon if applicable
  const getDisplayedCoupons = () => {
    if (isFirstTimeBuyer) {
      return [firstTimeCoupon, ...availableCoupons];
    }
    return availableCoupons;
  };

  const validateCouponCondition = (coupon) => {
    const subtotal = getTotalCartAmount();
    let isValid = true;

    if (coupon.type === "special" && coupon.name === "WELCOME200") {
      if (subtotal > 500) {
        coupon.discount = 200;
      } else {
        coupon.discount = (subtotal * 30) / 100;
      }
      return isValid; // Always valid for first-time coupon
    }

    const description = coupon.description.toLowerCase();
    // Check for "flat" or "percentage" discount
    if (description.includes("flat")) {
      const match = description.match(/flat\s*(\d+)/);
      if (match) {
        coupon.type = "flat";
        coupon.discount = parseInt(match[1]);
      }
    } else if (description.includes("%")) {
      const match = description.match(/(\d+)%/);
      if (match) {
        coupon.type = "percentage";
        const percentage = parseInt(match[1]);
        coupon.discount = (subtotal * percentage) / 100; // Calculate % of total
      }
    }

    // Check for minimum purchase condition
    if (description.includes("above")) {
      const match = description.match(/above\s*(\d+)/);
      if (match) {
        const minAmount = parseInt(match[1]);
        if (subtotal < minAmount) {
          isValid = false;
          setCouponMessage(
            `❌ Minimum purchase of ₹${minAmount} required for this coupon!`
          );
        }
      }
    }

    return isValid;
  };

  // Reset applied coupon if cart changes
  useEffect(() => {
    if (appliedCoupon) {
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setCouponMessage("⚠️ Coupon removed due to cart modification.");
    }
  }, [cartItems]);

  const handleCouponSubmit = () => {
    if (selectedCoupon && selectedCoupon.name === promoCode) {
      // Check for special first-time buyer coupon
      if (selectedCoupon.name === "WELCOME200") {
        // Calculate discount properly before setting the message
        validateCouponCondition(selectedCoupon); // Ensure discount is calculated
        saveDiscountDetails(selectedCoupon.name, selectedCoupon.discount);
        setDiscountAmount(selectedCoupon.discount);
        setAppliedCoupon(selectedCoupon);
        setCouponMessage(
          `🎉 WELCOME200 Applied! You saved ₹${selectedCoupon.discount}`
        );
        return;
      }

      // Regular coupon logic
      if (validateCouponCondition(selectedCoupon)) {
        calculateDiscount(selectedCoupon); // Correct discount calculation
        saveDiscountDetails(selectedCoupon.name, selectedCoupon.discount);
        setCouponMessage(
          `🎉 Coupon Applied! You saved ₹${selectedCoupon.discount}`
        );
      }
    } else {
      setDiscountAmount(0);
      setAppliedCoupon(null);
      setCouponMessage("❌ Invalid coupon or expired.");
    }
  };

  // Calculate Discount Logic
  const calculateDiscount = (coupon) => {
    const subtotal = getTotalCartAmount();
    let discount = 0;

    if (coupon.type === "percentage") {
      discount = (subtotal * coupon.discount) / 100;
    } else if (coupon.type === "flat") {
      discount = coupon.discount;
    }

    setDiscountAmount(discount);
    setAppliedCoupon(coupon);
  };

  const getFinalAmount = () => {
    const subtotal = getTotalCartAmount();
    if (appliedCoupon && appliedCoupon.discount) {
      return (subtotal - appliedCoupon.discount).toFixed(2);
    }
    return subtotal.toFixed(2);
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format cartitems-format-main">
                <img
                  src={e.image[0]}
                  alt=""
                  className="carticon-product-icon"
                />
                <p>{e.name}</p>
                <p>₹{e.new_price}</p>
                <button className="cartitems-quantity">
                  {cartItems[e.id]}
                </button>
                <p>₹{e.new_price * cartItems[e.id]}</p>
                <img
                  className="cartitems-remove-icon"
                  src={remove_icon}
                  onClick={() => {
                    removeFromCart(e.id);
                  }}
                  alt=""
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>SubTotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            {appliedCoupon && (
              <>
                <div className="cartitems-total-item discount-row">
                  <p>{appliedCoupon.name} </p>
                  <p style={{ color: "green" }}>
                    (₹{appliedCoupon.discount} Off)
                  </p>
                </div>
                <hr />
              </>
            )}
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>₹{getFinalAmount()}</h3>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>Want to Apply Promocode Coupons to avail offer??</p>
          <button
            className="search-coupon-btn"
            onClick={() => setShowPromoDialog(true)}
          >
            Search Here
          </button>
          <div className="cartitems-promobox">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button onClick={handleCouponSubmit}>Submit</button>
          </div>
          {couponMessage && <p className="coupon-message">{couponMessage}</p>}
        </div>
      </div>

      {/* Promo Code Dialog */}
      {showPromoDialog && (
        <div
          className="promo-dialog"
          onClick={(e) => {
            if (e.target.className === "promo-dialog") {
              setShowPromoDialog(false);
            }
          }}
        >
          <div className="promo-dialog-content">
            <h2>Select a Promo Code</h2>
            <div className="promo-list">
            {getDisplayedCoupons().map((coupon) => {
  const isExpired = coupon.expiry && new Date(coupon.expiry) < new Date();
  return (
    <div
      key={coupon._id}
      className={`promo-item ${isExpired ? "expired-coupon" : ""}`}
      onClick={() => {
        if (!isExpired) applyCoupon(coupon);
      }}
      style={{ cursor: isExpired ? "not-allowed" : "pointer", opacity: isExpired ? 0.6 : 1 }}
    >
      <FaGift size={30} color={isExpired ? "gray" : "red"} />
      <div className="promo-item-content">
        <h3>{coupon.name}</h3>
        <p>{coupon.description}</p>
        {coupon.name !== "WELCOME200" && (
          <p>
            Valid Till: {new Date(coupon.expiry).toLocaleDateString()}
            {isExpired && (
              <span style={{ color: "red", marginLeft: "10px" }}>
                (Expired)
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
})}

            </div>
            {/* <button
              className="close-btn"
              onClick={() => setShowPromoDialog(false)}
            >
              Close
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItems;
