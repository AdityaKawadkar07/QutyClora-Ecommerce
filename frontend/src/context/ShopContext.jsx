import React, { createContext, useEffect, useState } from 'react'
const BACKEND_API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300 + 1; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [appliedCoupon, setAppliedCoupon] = useState(null); // Coupon state
    const [discountDetails, setDiscountDetails] = useState({
        name: '',
        amount: 0,
      });


    useEffect(() => {
        fetch(`${BACKEND_API_URL}/allproducts`)
            .then((response) => response.json())
            .then((data) => setAll_Product(data))
            .catch(error => console.error('Error fetching products:', error));

        if (localStorage.getItem('auth-token')) {
            fetch(`${BACKEND_API_URL}/getcart`, {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: "",
            })
            .then((response) => {
                if (response.status === 401) {
                    localStorage.removeItem('auth-token');
                    setCartItems(getDefaultCart());
                    window.location.reload();
                }
                return response.json();
            })
            .then((data) => setCartItems(data))
            .catch(error => console.error('Error fetching cart:', error));
        }
    }, [])


    const addToCart = async (itemId, quantity = 1) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + quantity,
        }));

        if (localStorage.getItem('auth-token')) {
            try {
                for (let i = 0; i < quantity; i++) {
                    const response = await fetch(`${BACKEND_API_URL}/addtocart`, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'auth-token': `${localStorage.getItem('auth-token')}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ itemId }),
                    });
                    
                    if (response.status === 401) {
                        localStorage.removeItem('auth-token');
                        setCartItems(getDefaultCart());
                        window.location.reload();
                        return;
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                console.log(`Successfully added ${quantity} items`);
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
        }
    }


    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (localStorage.getItem('auth-token')) {
            fetch(`${BACKEND_API_URL}/removefromcart`, {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "itemId": itemId }),
            })
            .then((response) => {
                if (response.status === 401) {
                    localStorage.removeItem('auth-token');
                    setCartItems(getDefaultCart());
                    window.location.reload();
                }
                return response.json();
            })
            .then((data) => console.log(data))
            .catch(error => console.error('Error removing from cart:', error));
        }
    }

    
    const applyCoupon = (coupon) => {
        setAppliedCoupon(coupon);
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
    };

    
    const saveDiscountDetails = (discountName, discountAmount) => {
        setDiscountDetails({ discount_name: discountName, discount_amount: discountAmount });
      };
      

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }

        if (appliedCoupon) {
            totalAmount -= appliedCoupon.discount_amount;
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }

    // Retrieves product details from the cart for receipt generation
const getCartProductDetails = () => {
    let cartDetails = [];
    for (const item in cartItems) {
        if (cartItems[item] > 0) {
            let itemInfo = all_product.find((product) => product.id === Number(item));
            if (itemInfo) {
                cartDetails.push({
                    name: itemInfo.name,
                    quantity: cartItems[item],
                    price: itemInfo.new_price,
                    total: itemInfo.new_price * cartItems[item],
                });
            }
        }
    }
    return cartDetails;
};


    const contextValue = { getTotalCartItems, getTotalCartAmount,getCartProductDetails, all_product, cartItems, addToCart, removeFromCart, appliedCoupon,applyCoupon,removeCoupon, discountDetails,
        saveDiscountDetails };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;
