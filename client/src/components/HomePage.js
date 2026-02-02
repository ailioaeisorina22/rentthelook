import React from "react";
import "./HomePage.css"
import { useEffect } from "react";
import { useState } from "react";
import {useNavigate } from "react-router-dom";

const HomePage = (props) => {
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuth(true);
        }
        else {
            setIsAuth(false);
        }
    }, []);

    const handleLogin = () => {
        navigate('/login');
    }

    const handleLogout= () => {
        localStorage.removeItem('token');  // Șterge token-ul la logout
        setIsAuth(false);  // Schimbă state-ul pentru a reflecta logout-ul
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
    }
    const handleProfileClick = () => {
        const userId = localStorage.getItem("userId");
        navigate(`/${userId}/profile`);
    }

    const handleClickWomen = () =>{
        navigate("/women");
    }
    const handleClickMen = () =>{
        navigate("/men");
    }
    const handleClickKids = () =>{
        navigate("/kids");
    }
    const handleCartClick = () => {
        navigate("/cart");
    }
    return(props && ( <div className="homepage">
         <div className="homepage-head">
            <h1 className="title">RentTheLook</h1>
            {isAuth ? (<>
                <button className="btn-cart" onClick={handleCartClick}></button>
                <button className="btn-profile" onClick={handleProfileClick}></button>
                <button className="btn-login" onClick={handleLogout}>LogOut</button>
                </> 
            ) : (
                <button className="btn-login" onClick={handleLogin}>LogIn</button> 
            )}
            
        </div>
        <div className="homepage-body-btn">
            <button className="women" onClick={handleClickWomen}>
                FEMEI</button>
            <button className="men" onClick={handleClickMen}>BĂRBAȚI</button>
            <button className="kids"onClick={handleClickKids}>COPII</button>
        </div>

        <div className="message-hp">
            <h4>Închiriază, nu cumpăra! 🌿☀️</h4>
            <p>
            🌍 Știai că industria textilă este una dintre cele mai poluante din lume? 🌍 
               </p> <p>Fiecare articol produs consumă resurse prețioase și generează deșeuri.👕👖
            </p>
            <p>Alegând să închiriezi haine și textile, reduci risipa, economisești bani și contribui la un viitor mai sustenabil.</p>
                <li>🔄 Reutilizare - Dă o viață nouă hainelor, evitând supra-consumul.</li>
                <li>🌱 Eco-friendly - Mai puțină producție, mai puțină poluare.</li>
                <li>💰 Economisire - Acces la produse de calitate fără costuri mari.</li>
                <br></br>
                Fii parte din schimbare! Alege sustenabilitatea și închiriază în loc să cumperi. ♻️✨😊
                <br></br>
                <br></br>
        </div>

    </div>));
}

export default HomePage;