import React, { useContext, useEffect, useState } from 'react';
import './ProductDisplay.css';
import star_icon from '../assets/star_icon.png';
import star_dull_icon from '../assets/star_dull_icon.png';
import { ShopContext } from '../../context/ShopContext';  // FIXED IMPORT
// import image_main from '../assets/product_1.png'
// import image_sub1 from '../assets/product_2.png'
// import image_sub2 from '../assets/product_3.png'
// import image_sub3 from '../assets/product_4.png'
// import image_sub4 from '../assets/product_5.png'

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);  // DIRECTLY USING useContext

    const storedQuantity = localStorage.getItem(`product-${product.id}-quantity`);
    const [quantity, setQuantity] = useState(storedQuantity ? parseInt(storedQuantity, 10) : 1);
    const [mainImage, setMainImage] = useState(product.image[0]);



    useEffect(() => {
        localStorage.setItem(`product-${product.id}-quantity`, quantity);
    }, [quantity, product.id]);

    const increaseQuantity = () => {
        setQuantity((prev) => Math.min(prev + 1, 5)); // Max limit 5
      };
    
      const decreaseQuantity = () => {
        setQuantity((prev) => Math.max(prev - 1, 1)); // Min limit 1
      };

    return (
        <div className='productdisplay'> 
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    {product.image.map((img, index) => (
                        <img 
                            key={index} 
                            src={img} 
                            alt="" 
                            onClick={() => setMainImage(img)} 
                        />
                    ))}
                </div>

                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={mainImage} alt="" />
                </div>

            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-stars">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>(122)</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">₹{product.old_price}</div>
                    <div className="productdisplay-right-price-new">₹{product.new_price}</div>
                </div>
                <div className="productdisplay-right-description">
                    {product.description}
                </div>

                <div className="productdisplay-right-size">
                    {/* Quantity Selector */}
                 <div className="quantity-selector">
                 <button className="btn" onClick={decreaseQuantity}>−</button>
                 <span className="quantity">{quantity}</span>
                <button className="btn" onClick={increaseQuantity}>+</button>
                </div>
                </div>
                {/* Add to Cart Button */}
                <button 
                    className='produtctdisplay-addtocart' 
                    onClick={() => {
                        const token = localStorage.getItem('auth-token');
                        if (!token) {
                            alert('Please login/signup first');
                            return;
                        }
                        addToCart(product.id, quantity);
                    }}
                >
                    ADD TO CART
                </button>

            </div>
        </div>
    );
};

export default ProductDisplay;
