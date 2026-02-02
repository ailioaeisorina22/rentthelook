import React from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import "./Checkout.css";

const Declined = () => {
  const navigate = useNavigate();

  return (
    <div className="checkout-page">
      <NavigationBar />
      <div className="succes-container">
        <h2>❌ Plata a fost anulată</h2>
        <p>Nu s-a efectuat nicio plată. Poți încerca din nou oricând dorești.</p>
        <button onClick={() => navigate("/checkout")}>Înapoi la Checkout</button>
      </div>
    </div>
  );
};

export default Declined;
