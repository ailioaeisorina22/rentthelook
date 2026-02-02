import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ProductPage.css";

const Feedback = ({productId}) => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/feedback/product/${productId}`)
        .then(res => res.json())
        .then(data => setFeedbacks(data))
        .catch(err => console.error("Eroare la preluarea feedbackurilor:", err));
    }, [productId]);

  return (
    <div className="feedback-section">
    <h4>Recenzii</h4>
    {feedbacks.length === 0 ? (
      <p>Nu există feedback pentru acest produs.</p>
    ) : (
      feedbacks.map((fb, index) => (
        <div key={index} className="feedback-item">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < fb.Rating ? "filled-star" : "empty-star"}>★</span>
            ))}
          </div>
          <p className="description">Utilizator #{fb.User.UserFirstName} : {fb.FeedbackDescription}</p>
        </div>
      ))
    )}
  </div>
  );
};

export default Feedback;
