import React, { useContext, useState, useEffect } from 'react';
import './PlaceOrder.css';
import { ShopContext } from '../../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import qr from '../../components/assets/QR_code.jpg';

const PlaceOrder = () => {
    const { getTotalCartAmount, cartItems, all_product, discountDetails } = useContext(ShopContext);
    console.log(discountDetails.discount_name);  // Coupon name
    console.log(discountDetails.discount_amount);  // Discount amount
    const [showModal, setShowModal] = useState(false);
    const [paymentProof, setPaymentProof] = useState(null);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
    const [loading, setLoading] = useState(false); // Added loading state
    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        state: '',
        pinCode: '',
        country: '',
        phoneNo: '',
    });

    const navigate = useNavigate();

    // Handle input change
    const handleInputChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPaymentProof(file);
        }
    };

    // Extract cart items
    const formattedCartItems = Object.keys(cartItems)
        .filter((productId) => cartItems[productId] > 0)
        .map((productId) => {
            const product = all_product.find((p) => p.id === parseInt(productId));
            return product
                ? {
                      name: product.name,
                      quantity: cartItems[productId],
                  }
                : null;
        })
        .filter(Boolean);

    // Handle order submission
    const handlePlaceOrder = async () => {
        console.log('Formatted Cart Items:', formattedCartItems);
        if (formattedCartItems.length === 0) {
            alert('No items in the cart.');
            return;
        }
        if (
            !address.firstName.trim() ||
            !address.lastName.trim() ||
            !address.street.trim() ||
            !address.city.trim() ||
            !address.state.trim() ||
            !address.pinCode.trim() ||
            !address.country.trim() ||
            !address.phoneNo.trim()
        ) {
            alert('Please fill out all delivery details and phone number.');
            return;
        }

        setLoading(true); // Start loading

        const finalAmount = Math.max(getTotalCartAmount() - (discountDetails.discount_amount || 0), 0); // Ensure non-negative value

        const formData = new FormData();
        formData.append(
            'data',
            JSON.stringify({
                items: formattedCartItems,
                amount: finalAmount,
                discount_name: discountDetails.discount_name, // Append discount name directly
                discount_amount: discountDetails.discount_amount, // Append discount amount directly
                address: {
                    addressLine: `${address.firstName} ${address.lastName}, ${address.street}, ${address.city}, ${address.state}, ${address.pinCode}, ${address.country}`,
                    phoneNo: address.phoneNo,
                },
            })
        );

        if (paymentProof) {
            formData.append('paymentSS', paymentProof);
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/placeorder`, {
                method: 'POST',
                headers: {
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                alert('Order placed successfully!');
                navigate(`/my-order/${localStorage.getItem('user-id')}`);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Countdown effect
    useEffect(() => {
        let timer;
        if (showModal && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setShowModal(false);
        }

        return () => clearInterval(timer);
    }, [showModal, timeLeft]);

    return (
        <>
            <form className="place-order">
                <div className="place-order-left">
                    <p className="title">Delivery Information</p>
                    <div className="multi-fields">
                        <input type="text" name="firstName" placeholder="First Name" onChange={handleInputChange} />
                        <input type="text" name="lastName" placeholder="Last Name" onChange={handleInputChange} />
                    </div>
                    <input type="email" name="email" placeholder="Email address" onChange={handleInputChange} />
                    <input type="text" name="street" placeholder="Street" onChange={handleInputChange} />
                    <div className="multi-fields">
                        <input type="text" name="city" placeholder="City" onChange={handleInputChange} />
                        <input type="text" name="state" placeholder="State" onChange={handleInputChange} />
                    </div>
                    <div className="multi-fields">
                        <input type="text" name="pinCode" placeholder="Pin Code" onChange={handleInputChange} />
                        <input type="text" name="country" placeholder="Country" onChange={handleInputChange} />
                    </div>
                    <input type="text" name="phoneNo" placeholder="Phone" onChange={handleInputChange} />
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
                                <p>-₹{discountDetails.discount_amount}</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>Total:</p>
                                <b>₹{getTotalCartAmount()-discountDetails.discount_amount}</b>
                            </div>
                        </div>
                        <button type="button" onClick={() => setShowModal(true)}>
                            PROCEED TO PAYMENT
                        </button>
                    </div>
                </div>
            </form>

            {showModal && (
                <div className="payment-modal">
                    <div className="modal-content">
                        <h2>Scan & Pay</h2>
                        <h3>₹{getTotalCartAmount()-discountDetails.discount_amount}</h3>
                        <img src={qr} alt="QR Code" className="qr-code" />
                        <p className="timer">
                            Time left: <b>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</b>
                        </p>
                        <label className="upload-label">
                            Upload Screenshot of Payment
                            <input type="file" accept="image/*" onChange={handleFileUpload} />
                        </label>
                        {paymentProof && (
    <button
        className="done-btn"
        onClick={handlePlaceOrder}
        disabled={loading} // Disable only during loading
    >
        {loading ? <div className="spinner"></div> : 'Place Order'}
    </button>
)}
                        <button className="close-btn" onClick={() => setShowModal(false)}>
                            X
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default PlaceOrder;
