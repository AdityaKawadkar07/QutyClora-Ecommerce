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


const BACKEND_API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);  // DIRECTLY USING useContext

    const storedQuantity = localStorage.getItem(`product-${product.id}-quantity`);
    const [quantity, setQuantity] = useState(storedQuantity ? parseInt(storedQuantity, 10) : 1);
    const [mainImage, setMainImage] = useState(product.image[0]);

    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);

    useEffect(() => {
        localStorage.setItem(`product-${product.id}-quantity`, quantity);
    }, [quantity, product.id]);

    const increaseQuantity = () => {
        setQuantity((prev) => Math.min(prev + 1, 5)); // Max limit 5
      };
    
      const decreaseQuantity = () => {
        setQuantity((prev) => Math.max(prev - 1, 1)); // Min limit 1
      };

      useEffect(() => {
        const fetchReviews = async () => {
          try {
            const res = await fetch(`${BACKEND_API_URL}/get-reviews/${product._id}`);
            const data = await res.json();
            if (res.ok) {
              setReviews(data.reviews);
              const totalRating = data.reviews.reduce((acc, curr) => acc + curr.rating, 0);
              const avg = data.reviews.length ? totalRating / data.reviews.length : 0;
              setAvgRating(avg.toFixed(1));
            }
          } catch (err) {
            console.error("Error fetching reviews", err);
          }
        };
    
        if (product?._id) fetchReviews();
      }, [product]);

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
        {/* ⭐ Dynamic Star Rating Section */}
        <div className="productdisplay-right-stars-wrapper">
  <div className="productdisplay-right-stars">
    {[...Array(5)].map((_, i) => {
      const filled = Math.min(Math.max(avgRating - i, 0), 1) * 100;
      return (
        <div className="star-wrapper" key={i}>
          <div className="star-empty" />
          <div className="star-filled" style={{ width: `${filled}%` }} />
        </div>
      );
    })}
    <p>({reviews.length})</p>
    <span className="rating-tooltip">{avgRating} / 5</span>
  </div>
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
