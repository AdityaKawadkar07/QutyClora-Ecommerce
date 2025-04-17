import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, cartItems, all_product, discountDetails } =
    useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    phoneNo: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const formattedCartItems = Object.keys(cartItems)
    .filter((productId) => cartItems[productId] > 0)
    .map((productId) => {
      const product = all_product.find((p) => p.id === parseInt(productId));
      return product
        ? { name: product.name, quantity: cartItems[productId] }
        : null;
    })
    .filter(Boolean);

  const handlePlaceOrder = async () => {
    if (formattedCartItems.length === 0) {
      alert("No items in the cart.");
      return;
    }

    const {
      firstName,
      lastName,
      street,
      city,
      state,
      pinCode,
      country,
      phoneNo,
    } = address;
    if (
      !firstName ||
      !lastName ||
      !street ||
      !city ||
      !state ||
      !pinCode ||
      !country ||
      !phoneNo
    ) {
      alert("Please fill all delivery details.");
      return;
    }

    const finalAmount = Math.max(
      getTotalCartAmount() - (discountDetails.discount_amount || 0),
      0
    );

    try {
      setLoading(true);
      // Step 1: Create Razorpay order
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/create-razorpay-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
          body: JSON.stringify({ amount: finalAmount }),
        }
      );

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to create Razorpay order");
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        name: "MyShop",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async function (response) {
          const payload = {
            items: formattedCartItems,
            amount: finalAmount,
            discount_name: discountDetails.discount_name || "",
            discount_amount: discountDetails.discount_amount || 0,
            address: {
              addressLine: `${firstName} ${lastName}, ${street}, ${city}, ${state}, ${pinCode}, ${country}`,
              phoneNo,
            },
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const placeRes = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/placeorder`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("auth-token"),
              },
              body: JSON.stringify(payload),
            }
          );

          const placeData = await placeRes.json();
          if (placeData.success) {
            alert("Order placed successfully!");
            navigate(`/my-order/${localStorage.getItem("user-id")}`);
          } else {
            alert(placeData.message || "Order placement failed.");
          }
        },
        prefill: {
          name: `${firstName} ${lastName}`,
          email: "", // Optional
          contact: phoneNo,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Processing your order...</p>
        </div>
      )}
      <form className="place-order">
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleInputChange}
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="street"
            placeholder="Street"
            onChange={handleInputChange}
          />
          <div className="multi-fields">
            <input
              type="text"
              name="city"
              placeholder="City"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              onChange={handleInputChange}
            />
          </div>
          <div className="multi-fields">
            <input
              type="text"
              name="pinCode"
              placeholder="Pin Code"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              onChange={handleInputChange}
            />
          </div>
          <input
            type="text"
            name="phoneNo"
            placeholder="Phone"
            onChange={handleInputChange}
          />
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal:</p>
                <p>₹{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee:</p>
                <p>₹0.00</p>
              </div>
              <hr />
              <div className="cart-total-details discount">
                <p>Discount:</p>
                <p>-₹{discountDetails.discount_amount || 0}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Total:</p>
                <b>
                  ₹
                  {getTotalCartAmount() -
                    (discountDetails.discount_amount || 0)}
                </b>
              </div>
              {discountDetails.discount_amount > 0 && (
                <div className="discount-warning">
                  ⚠️Please do not refresh the page or your discount may not be
                  applied.
                </div>
              )}
            </div>
            <button type="button" onClick={handlePlaceOrder} disabled={loading}>
              {loading ? <div className="spinner"></div> : "PROCEED TO PAY"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PlaceOrder;
