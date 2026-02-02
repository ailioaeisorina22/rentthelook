import React from "react";
import "./Profile.css";
import NavigationBar from "./NavigationBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Profile = () => {
    const {uid} = useParams();
    const [userData, setUserData] = useState(null);
    const [rentals, setRentals] = useState([]);
    const [activeFeedbackItem, setActiveFeedbackItem] = useState(null);
    const [feedbackText, setFeedbackText] = useState("");    
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(null);

    //facem feth pt a lua datele userului
    useEffect(() => {
        fetch(`http://localhost:8080/api/users/${uid}`)
        .then(res => res.json())
        .then(data => setUserData(data))
        .catch(err => console.error("Eroare la preluarea datelor utilizatorului" + err));
    },[uid]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/rentals/user/${uid}`)
          .then(res => res.json())
          .then(data => setRentals(data))
          .catch(err => console.error("Eroare la preluarea închirierilor: ", err));
      }, [uid]);
    
    const currentItems = rentals.flatMap(r => 
        r.RentalItems?.filter(item => item.Status !== "incheiata") || []
      );
      
    const pastItems = rentals.flatMap(r => 
        r.RentalItems?.filter(item => item.Status === "incheiata") || []
    );
    
    
    const handleSubmitFeedback = async (sizeId) => {
        const userId = localStorage.getItem("userId");

        try {
          const response = await fetch("http://localhost:8080/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              sizeId,
              description: feedbackText,
              rating: rating
            }),
          });
      
          const data = await response.json();
          if (response.ok) {
            alert("Feedback trimis cu succes!");
            setFeedbackText("");
            setRating(0);
            setActiveFeedbackItem(null);
          } else {
            alert("Eroare: " + data.message);
          }
        } catch (err) {
          console.error("Eroare la trimiterea feedback-ului:", err);
          alert("A apărut o eroare.");
        }
      };
    return (
        <div className="profile">
            <NavigationBar></NavigationBar>
            <h2 className="title">PROFIL</h2>
            {
                userData ? (
                    <div className="user-data">
                        <p>Nume: {userData.UserLastName} </p>
                        <p>Prenume: {userData.UserFirstName} </p>
                        <p>Vârsta: {userData.UserAge} </p>
                        <p>Email: {userData.Email} </p>
                        <p>Gen: {userData.UserGender} </p>
                        <p>Telefon: {userData.Phone} </p>
                        {/* {userData && userData.Role?.toUpperCase() !== "ADMIN" && (
                             //<p className="credit">Credit: {userData.Credit} lei</p>
                        )}   */}
                    </div>
                ) : (<p>Loading...</p>)
            }
            {userData && userData.Role !== "ADMIN" && 
            <>
                <h3>Comenzi curente</h3>
                {currentItems.length === 0 ? <p className="no-orders">Nu ai comenzi active.</p> :
                currentItems.map((item, idx) => (
                    <div key={idx} className="order-card">
                    <p className="product-name">{item.ProductSize.Product.ProductName} -- ID Comanda: {item.RentalId}</p>
                    <p>Preț: <strong>{item.Price} lei</strong></p>
                    <p>Garanție: {item.ProductSize.Product.Deposit} lei</p>
                    <p>Data: {item.StartDate} - {item.EndDate}</p>
                    <span className={`order-badge ${item.Status}`}>{item.Status}</span>
                    </div>
                ))}

                <h3>Istoric comenzi</h3>
                {pastItems.length === 0 ? <p className="no-orders">Nu ai comenzi încheiate.</p> :
                pastItems.map((item, idx) => (
                    <div key={idx} className="order-card">
                    <p className="product-name">{item.ProductSize.Product.ProductName} -- ID Comanda: {item.RentalId}</p>
                    <p>Preț: <strong>{item.Price} lei</strong></p>
                    <p>Garanție: {item.ProductSize.Product.Deposit} lei</p>
                    <p>Data: {item.StartDate} - {item.EndDate}</p>
                    <span className="order-badge incheiata">incheiata</span>
                    <div style={{ marginTop: "1rem" }}>
                    <button className="feedback-btn" onClick={() => setActiveFeedbackItem(item.RentalItemId)}>
                        Adaugă feedback
                    </button>

                    {activeFeedbackItem === item.RentalItemId  && (
                    <div className="feedback-form">
                        <div className="star-rating">
                            <p>Rating: </p>
                            {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= (hoveredStar || rating) ? "filled" : ""}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(null)}
                            >
                                ★
                            </span>
                            ))}
                            </div>
                        <input
                        type="text"
                        placeholder="Scrie un feedback..."
                        className="feedback-message"
                        onChange={(e) => setFeedbackText(e.target.value)}
                        />
                        
                        <button className="submit-feedback-btn" onClick={ () => {handleSubmitFeedback(item.ProductSize.SizeId)}}>Trimite</button>
                    </div>
                    )}
                    </div>
                </div>
                ))}
                </>
             }

    </div>
);}

export default Profile;