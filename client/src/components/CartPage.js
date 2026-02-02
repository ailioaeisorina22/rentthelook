import React, { useEffect, useState } from "react";
import "./CartPage.css";
import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId)
         return;

    fetch(`http://localhost:8080/api/cart/${userId}/active`)
      .then((res) => res.json())
      .then((data) => setCartItems(data.cartItems))
      .catch((err) =>
        console.error("Eroare la preluarea produselor din coș:", err)
      );
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const zi = String(date.getDate()).padStart(2, '0');
    const luna = String(date.getMonth() + 1).padStart(2, '0'); // lunile sunt 0-based
    const an = date.getFullYear();
    return `${zi}/${luna}/${an}`;
  };

  const refreshCart = () => {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:8080/api/cart/${userId}/active`)
      .then((res) => res.json())
      .then((data) => setCartItems(data.cartItems))
      .catch((err) => console.error("Eroare la actualizarea coșului:", err));
  };
  
  const deleteCartProduct = (itemId) => {
    fetch(`http://localhost:8080/api/cart/${itemId}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error("Eroare la ștergere");
        return res.json();
      })
      .then(() => refreshCart()) 
      .catch((err) => console.error(err));
  };

  const totalCartPrice = cartItems.reduce((total, item) => {
    const itemPrice = item.ItemPrice || 0;
    const deposit = parseFloat(item.ProductSize?.Product?.Deposit || 0);
    return total + itemPrice + deposit;
  }, 0);

  const updateCartTotal = async (total) => {
    const userId = localStorage.getItem("userId");
    try {
      await fetch(`http://localhost:8080/api/cart/${userId}/total`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({totalPrice: total })
      });
    } catch (err) {
      console.error("Eroare la actualizarea TotalPrice în Cart:", err);
    }
  };
  
  useEffect(() => {
  if (cartItems.length > 0) {
    const total = cartItems.reduce((total, item) => {
      const itemPrice = item.ItemPrice || 0;
      const deposit = parseFloat(item.ProductSize?.Product?.Deposit || 0);
      return total + itemPrice + deposit;
    }, 0);

    updateCartTotal(total);
  }
}, [cartItems]);

  return (
    <div className="cart-page">
      <NavigationBar />
      <h2 className="title">COȘ DE CUMPĂRĂTURI</h2>

      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Coșul este gol.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.CartItemId} className="cart-item">
              <img
                src={item.ProductSize?.Product?.Images[0]?.Url}
                alt={item.ProductSize?.Product?.ProductName}
              />
              <div className="cart-item-details">
                <p className="product-name">{item.ProductSize?.Product?.ProductName}</p>
                <p>Mărime: {item.ProductSize.Size}</p>
                <p>Perioadă: {formatDate(item.StartDate)} - {formatDate(item.EndDate)}</p>
                <p>Preț: {item.ItemPrice} lei</p>
                <p>Garanție: {item.ProductSize?.Product?.Deposit} lei</p>
                <div className="delete-btn">
                <p className="price-total">Preț total: {item.ItemPrice + parseFloat(item.ProductSize?.Product?.Deposit || 0)} lei</p>
                <button
                onClick={() => {
                  const confirmDelete = window.confirm("Ești sigur că vrei să ștergi acest produs din coș?");
                  if (confirmDelete) {
                    deleteCartProduct(item.CartItemId);
                  }
                }}
                >Șterge</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {cartItems.length > 0 && (
      <div className="total-section">
      <p className="total-text">Total: {totalCartPrice} lei</p>
      <div className="btn-rent">
      <button onClick={() => navigate('/checkout')}>Plasează comanda</button>
      </div> 
      </div>)} 
    </div>
    
  );
};

export default CartPage;
