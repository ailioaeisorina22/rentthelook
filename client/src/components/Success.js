import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import NavigationBar from "./NavigationBar";
import "./Checkout.css";

const Succes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const calledRef = useRef(false);

useEffect(() => {
  if (calledRef.current) return;

  const params = new URLSearchParams(location.search);
  const sessionId = params.get("session_id");

  if (sessionId) {
    calledRef.current = true;
    fetch(`http://localhost:8080/api/confirm-payment/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("✅ Comanda salvată");
        }
      })
      .catch((err) => console.error("Eroare confirmare plată:", err));
  }
}, [location]);

  return (
    <div className="checkout-page">
      <NavigationBar />
      <div className="succes-container">
        <h2>✅ Plata a fost efectuată cu succes!</h2>
        <p>Comanda ta este înregistrată și va fi procesată în cel mai scurt timp.</p>
        <button onClick={() => navigate("/")}>Înapoi la homepage</button>
      </div>
    </div>
  );
};

export default Succes;
