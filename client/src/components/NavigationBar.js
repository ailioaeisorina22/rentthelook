import React, { useState, useRef, useEffect } from "react";
import "./NavigationBar.css"
import "./HomePage.css"
import {  useNavigate} from "react-router-dom";

const NavigationBar = () => {
    const [isOpenF, setIsOpenF]= useState(false);
    const [isOpenM, setIsOpenM]= useState(false);
    const [isOpenK, setIsOpenK]= useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const navigate = useNavigate();
    const dropdownRefF = useRef(null);
    const dropdownRefM = useRef(null);
    const dropdownRefK = useRef(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('userRole');
            setUserRole(role);
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
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        setIsAuth(false);
        window.location.href = '/';

      };
    const handleTitleClick = () =>{
        navigate('/');
    }
    const handleCartClick = () => {
        navigate("/cart");
    }
    const handleProfileClick = () => {
        const userId = localStorage.getItem("userId");
        navigate(`/${userId}/profile`);
    }
    const handleClothes = () =>{
        setIsOpenF(false);
        navigate(`/women/clothes`);
    }
    const handleShoes = () =>{
        setIsOpenF(false);
        navigate(`/women/shoes`);
    }
    const handleAccessories = () =>{
        setIsOpenF(false);
        navigate(`/women/accs`);
    }
    const handleClothesM = () =>{
        setIsOpenM(false);
        navigate(`/men/clothes`);
    }
    const handleShoesM = () =>{
        setIsOpenM(false);
        navigate(`/men/shoes`);
    }
    const handleAccessoriesM = () =>{
        setIsOpenM(false);
        navigate(`/men/accs`);
    }
    const handleClothesK = () =>{
        setIsOpenK(false);
        navigate(`/kids/clothes`);
    }
    const handleShoesK = () =>{
        setIsOpenK(false);
        navigate(`/kids/shoes`);
    }
    const handleAccessoriesK = () =>{
        setIsOpenK(false);
        navigate(`/kids/accs`);
    }

    useEffect(() => { //
        const handleClickOutside = (event) => {
          if (dropdownRefF.current && !dropdownRefF.current.contains(event.target)) {
            setIsOpenF(false);
          }
          if (dropdownRefM.current && !dropdownRefM.current.contains(event.target)) {
            setIsOpenM(false);
          }
          if (dropdownRefK.current && !dropdownRefK.current.contains(event.target)) {
            setIsOpenK(false);
          }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

    return( <div className="nav-bar">
                {userRole !== 'ADMIN' && (
                <>
                <div ref={dropdownRefF} className="dropdown-item">
                    <button className="dropdown-btn" onClick={() => setIsOpenF(!isOpenF)}>
                       Femei ⌄
                    </button>
                    {
                        isOpenF && (
                            <div className="dropdown-btns">
                            <button className="btn-option" onClick={handleClothes}>ÎMBRĂCĂMINTE</button>  
                            <button className="btn-option" onClick={handleShoes}>ÎNCĂLȚĂMINTE</button>
                            <button className="btn-option" onClick={handleAccessories}>ACCESORII</button>   
                            </div>
                    )}
                </div>
                <div ref={dropdownRefM} className="dropdown-item">
                    <button className="dropdown-btn" onClick={() => setIsOpenM(!isOpenM)}>
                       Bărbați ⌄
                    </button>
                    {
                        isOpenM && (
                            <div className="dropdown-btns">
                            <button className="btn-option" onClick={handleClothesM}>ÎMBRĂCĂMINTE</button>  
                            <button className="btn-option" onClick={handleShoesM}>ÎNCĂLȚĂMINTE</button>
                            <button className="btn-option" onClick={handleAccessoriesM}>ACCESORII</button>   
                            </div>
                    )}
                </div>
                <div ref={dropdownRefK} className="dropdown-item">
                    <button className="dropdown-btn" onClick={() => setIsOpenK(!isOpenK)}>
                       Copii ⌄
                    </button>
                    {
                        isOpenK && (
                            <div className="dropdown-btns">
                            <button className="btn-option" onClick={handleClothesK}>ÎMBRĂCĂMINTE</button>  
                            <button className="btn-option" onClick={handleShoesK}>ÎNCĂLȚĂMINTE</button>
                            <button className="btn-option" onClick={handleAccessoriesK}>ACCESORII</button>   
                            </div>
                    )}
                </div>
                </> )}
                <h1 className="title" onClick={handleTitleClick}>RentTheLook</h1>
                {isAuth ? (<>
                {userRole !== 'ADMIN' && (
                <button className="btn-cart"  onClick={handleCartClick}></button>
                )}
                <button className="btn-profile" onClick={handleProfileClick} ></button>
                <button className="btn-login" onClick={handleLogout}>LogOut</button>
                </>
                ) : (
                <button className="btn-login" onClick={handleLogin}>LogIn</button> 
                )}             
            </div>)
}

export default NavigationBar;