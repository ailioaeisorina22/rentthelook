import React, { useState } from "react";
import "./Checkout.css";
import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState("ramburs");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [termsAndConditions, setTermsAndConditions] = useState(false);    const navigate = useNavigate();
    const [useSavedAddress, setUseSavedAddress] = useState(true);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const uId = localStorage.getItem("userId");
    const [clientData, setClientData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      block: "",
      city: "",
      postalCode: ""
    });
    const stripePromise = loadStripe('pk_test_51RLTxmRfORTb8tCzC2aigq0K5j8BO8BWLGEVEB4KJcaXlQa9vUArRhTJQc4kEiDdHtoQ078utyCn2XHOwf54ylm900EacToRSP');

    useEffect(() => {
        const fetchUserDetails = async () => {
          try {
            const resUser = await fetch(`http://localhost:8080/api/users/${uId}`);
            const userData = await resUser.json();

            setClientData(prev => ({
              ...prev,
              firstName: userData.UserFirstName || "",
              lastName: userData.UserLastName || "",
              email: userData.Email || "",
              phone: userData.Phone || ""
            }));

            const resAddresses = await fetch(`http://localhost:8080/api/shipping/${uId}`);
            const addressData = await resAddresses.json();
            if (Array.isArray(addressData)) {
              setSavedAddresses(addressData);

              // Populează cu prima adresă salvată
              if (addressData.length > 0) {
                const first = addressData[0];
                setClientData(prev => ({
                  ...prev,
                  street: first.street || "",
                  block: first.block || "",
                  city: first.city || "",
                  postalCode: first.postalCode || ""
                }));
              }
            }
          } catch (err) {
            console.error("Eroare la preluarea datelor:", err);
          }
        };

        if (uId) fetchUserDetails();
      }, [uId]);

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("submit!!!");
    
      if (!termsAccepted) {
        alert("Trebuie să acceptați termenii și condițiile pentru a finaliza comanda.");
        return;
      }
    
      if (paymentMethod === "card") {
        const stripe = await stripePromise;
        try {
          const response = await 
              fetch("http://localhost:8080/api/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: uId, clientData, useSavedAddress })
          });
    
          const data = await response.json();
          if (data.url) {
            window.location.href = data.url;
          } else {
            alert("Nu s-a putut inițializa plata.");
          }
        } catch (error) {
          console.error("Eroare Stripe:", error);
        }
      } else {
        try {
          const response = await fetch("http://localhost:8080/api/cash-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: uId, clientData, useSavedAddress })
          });
      
          const data = await response.json();
          if (response.ok) {
            alert("Comandă plasată cu ramburs!");
            navigate('/profile');
          } else {
            alert("Eroare la plasarea comenzii: " + data.error);
          }
        } catch (err) {
          console.error("Eroare ramburs:", err);
          alert("Eroare server.");
        }
      }
    };
  

    return (
        <div className="checkout-page">
            <NavigationBar />
            <h2 className="title">Procesare comandă</h2>

            <form className="checkout-form" onSubmit={handleSubmit}>
                <section> 
                    <h3>Datele destinatarului/destinatarei</h3>
                    <div className="form-row">
                        <input type="text" placeholder="Prenume" required
                          value={clientData.firstName}
                          readOnly />
                        <input type="text" placeholder="Nume" required
                          value={clientData.lastName}
                          readOnly  />
                    </div>
                    <div className="form-row">
                        <input type="email" placeholder="E-mail" required
                          value={clientData.email}
                          readOnly  />
                        <input type="tel" placeholder="Număr de telefon - RO" required 
                          value={clientData.phone}
                         readOnly />
                    </div>
                </section>

                <section>
                    <h3>Adresă de livrare</h3>
                    <div className="form-row" style={{ alignItems: 'center' }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={useSavedAddress}
                        onChange={(e) => setUseSavedAddress(e.target.checked)}
                      />
                      Folosește o adresă salvată
                    </label>

                    {useSavedAddress && (
                      <>
                        {savedAddresses.length > 0 ? (
                          <select
                            onChange={(e) => {
                              const selected = savedAddresses.find(a => a.ShippingId == e.target.value);
                              if (selected) {
                                setClientData(prev => ({
                                  ...prev,
                                  street: selected.Street,
                                  block: selected.Block,
                                  city: selected.City,
                                  postalCode: selected.PostalCode
                                }));
                              }
                            }}
                          >
                            {savedAddresses.map(addr => (
                              <option key={addr.ShippingId} value={addr.ShippingId}>
                                {addr.City}, Strada: {addr.Street}, Bloc: {addr.Block}, Cod poștal: {addr.PostalCode}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="no-address-message">
                            Nu aveți adrese salvate. Debifați opțiunea pentru a introduce o adresă nouă.
                          </p>
                        )}
                      </>
                    )}

                  </div>
            {!useSavedAddress && <>
                  <div className="form-row">
                    <input type="text" placeholder="Strada și numărul" required 
                      value={clientData.street}
                      onChange={(e) => setClientData({ ...clientData, street: e.target.value })}
                    />
                    <input type="text" placeholder="Bloc, Scară, Apartament" 
                      value={clientData.block}
                      onChange={(e) => setClientData({ ...clientData, block: e.target.value })}
                    />
                  </div>
                  <div className="form-row">
                    <input type="text" placeholder="Oraș" required
                      value={clientData.city}
                      onChange={(e) => setClientData({ ...clientData, city: e.target.value })}
                    />
                    <input type="text" placeholder="Cod poștal" required 
                      value={clientData.postalCode}
                      onChange={(e) => setClientData({ ...clientData, postalCode: e.target.value })}
                    />
                  </div>
                  </>}
                </section>

        <h3>Metodă de plată</h3>
        <div className="payment-methods">
          <label>
            <input
              type="radio"
              name="payment"
              value="ramburs"
              checked={paymentMethod === "ramburs"}
              onChange={handlePaymentChange}
            />
            Ramburs
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={handlePaymentChange}
            />
            Card
          </label>
        </div>

          <div className="terms-checkbox">
                <label>
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={handleTermsChange}
                        />
                        Accept termenii și condițiile
                </label>
                <button type="button" className="terms-info" onClick={() => setTermsAndConditions(true)} onBlur={() => setTermsAndConditions(false)}>ℹ️</button>
                    {
                      termsAndConditions && 
                      <div className="q">
                      <p>Prin plasarea comenzii, clientul este de acord cu următoarele:</p>
                      <li>Produsele închiriate trebuie returnate în aceeași stare în care au fost livrate.</li>
                      <li>În cazul în care produsul este returnat cu deteriorări vizibile, lipsuri sau urme evidente de uzură excesivă, 
                        se va reține garanția pentru acoperirea costurilor de reparație sau înlocuire.</li>
                      <li>Dacă produsul este grav deteriorat sau irecuperabil,
                         clientul va fi responsabil pentru plata integrală a valorii de înlocuire, conform evaluării interne.</li>
                      <li>Garanția este returnabilă doar dacă produsul este returnat în termen și în stare corespunzătoare.</li>
                      </div>
                    }
            </div>

                <button type="submit" className="checkout-btn">
                    Finalizează comanda
                </button>
            </form>
        </div>
    );
};

export default Checkout;
