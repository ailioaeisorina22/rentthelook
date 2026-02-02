import React from "react";
import './Page.css'
import NavigationBar from './NavigationBar.js'
import { useLocation, useNavigate } from "react-router-dom";

const WomenPage = () =>{
    const location= useLocation();
    const navigate = useNavigate();

    const handleClothes = () =>{
        navigate(`/women/clothes`);
    }
    const handleShoes = () =>{
        navigate(`/women/shoes`);
    }
    const handleAccessories = () =>{
        navigate(`/women/accs`);
    }
    const handleClothesM = () =>{
        navigate(`/men/clothes`);
    }
    const handleShoesM = () =>{
        navigate(`/men/shoes`);
    }
    const handleAccessoriesM = () =>{
        navigate(`/men/accs`);
    }
    const handleClothesK = () =>{
        navigate(`/kids/clothes`);
    }
    const handleShoesK = () =>{
        navigate(`/kids/shoes`);
    }
    const handleAccessoriesK = () =>{
        navigate(`/kids/accs`);
    }


    if(location.pathname ==="/women"){
           return( <div className="women-page">
                <NavigationBar></NavigationBar>
                <div className="women-page-body">
                <button onClick={handleClothes}>ÎMBRĂCĂMINTE</button>  
                <button onClick={handleShoes}>ÎNCĂLȚĂMINTE</button>
                <button onClick={handleAccessories}>ACCESORII</button> 
                </div>
            </div>
        )};
    if(location.pathname ==="/men"){
            return( <div className="men-page">
                 <NavigationBar></NavigationBar>
                 <div className="men-page-body">
                    <button onClick={handleClothesM}>ÎMBRĂCĂMINTE</button>  
                    <button onClick={handleShoesM}>ÎNCĂLȚĂMINTE</button>
                    <button onClick={handleAccessoriesM}>ACCESORII</button> 
                 </div>
             </div>
         )};
    if(location.pathname ==="/kids"){
            return( <div className="kids-page">
                 <NavigationBar></NavigationBar>
                 <div className="kids-page-body">
                    <button onClick={handleClothesK}>ÎMBRĂCĂMINTE</button>  
                    <button onClick={handleShoesK}>ÎNCĂLȚĂMINTE</button>
                    <button onClick={handleAccessoriesK}>ACCESORII</button> 
                 </div>
             </div>
         )};
}

export default WomenPage;