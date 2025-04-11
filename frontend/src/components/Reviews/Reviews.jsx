import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import "./Reviews.css";

const BACKEND_API_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

const Reviews = ({ product }) => {
  //   console.log("Product in Reviews.jsx:", product);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]); // new state for fetched reviews

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/get-reviews/${product._id}`);
      const data = await response.json();
      if (response.ok) {
        setReviews(data.reviews);
      } else {
        console.error('Failed to fetch reviews:', data.message);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    if (product?._id) {
      fetchReviews();
    }
  }, [product]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("auth-token");

    if (!token) {
      alert("Please Login or Sign Up to provide reviews!");
      return;
    }

    if (!rating || !reviewText) {
      alert("Please fill in the rating and review text");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("comment", reviewText);
      formData.append("name", name || "Anonymous");
      if (imageFile) {
        formData.append("images", imageFile);
      }

      console.log(
        "Submitting review to:",
        `${BACKEND_API_URL}/add-review/${product._id}`
      );

      const response = await fetch(
        `${BACKEND_API_URL}/add-review/${product._id}`,
        {
          method: "POST",
          headers: {
            "auth-token": localStorage.getItem("auth-token") || "",
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Review submitted successfully!");
        setRating(0);
        setHoverRating(0);
        setName("");
        setImageFile(null);
        setReviewText("");
        fetchReviews();
      } else {
        console.error(result);
        alert(result.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reviews-container">
      <h3>Share your experience </h3>

      <div className="review-form">
        <div className="star-rating">
          {[...Array(5)].map((_, index) => {
            const currentRating = index + 1;
            return (
              <FaStar
                key={index}
                className="star"
                size={24}
                color={
                  currentRating <= (hoverRating || rating)
                    ? "#FFC107"
                    : "#e4e5e9"
                }
                onClick={() => setRating(currentRating)}
                onMouseEnter={() => setHoverRating(currentRating)}
                onMouseLeave={() => setHoverRating(0)}
              />
            );
          })}
        </div>
        <textarea
          className="review-textarea"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
        />
        <input
          type="text"
          className="review-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
        />
        <label className="review-upload-label">
          Upload Image (optional)
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </label>
        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="review-preview-img"
          />
        )}
        <button
          className="review-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>{" "}
      </div>

      {/* Render fetched reviews */}
      <div className="all-reviews">
        <h3>What others are saying</h3>
        {reviews.length === 0 && <p>No reviews yet. Be the first to share!</p>}
        {[...reviews].reverse().map((review, index) => (
          <div className="review-card" key={index}>
            <div className="review-header">
              <strong>{review.name}</strong>
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={16}
                    color={i < review.rating ? "#FFC107" : "#e4e5e9"}
                  />
                ))}
              </div>
              <span className="review-date">
                {new Date(review.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="review-text">{review.comment}</div>
            {review.images && review.images.length > 0 && (
              <img
                src={review.images[0]}
                alt="Review"
                className="review-image"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
