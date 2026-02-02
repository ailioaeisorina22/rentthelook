import {useNavigate } from 'react-router-dom';
import './LoginForm.css'
import React, { useState } from 'react'

const LoginForm = ({setIsAuth, setIsAdmin}) =>{
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
   
    const handleLoginClick = async (e) => {
        e.preventDefault();
        console.log(email);
        if (!email || !password) {
            setError("Introduceți emailul și parola!");
            return;
        }
        try {
            const response = await fetch("http://localhost:8080/api/login",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email,
                                         password: password })
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.message || "Autentificare eșuată!");
                return;
            }
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("userRole", data.role);
            setIsAuth(true);
            if(data.role === "ADMIN") {
                setIsAdmin(true);
                navigate('/admin/dashboard');
            }
            else {
                setIsAdmin(false);
                navigate("/");
            }
        } catch (err) {
            setError("Eroare server: " + err.message);
        }
    }
    const cancelLogin = () => {
        navigate("/");
    }
    const handleAuthClick = () => {
        navigate("/auth");
    }
//VALIDATORI??????????????????????????????????????????
    // const validateEmail = (email) =>{
    //     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     return regex.test(email);
    // }

    // const setEmailChange = (e) => {
    //     const value = e.target.value;
    //     setEmail(value);

    //     if(!validateEmail(value)){
    //         setError("Email invalid!");
    //     }
    //     else{ setError("");}
    //}
 return (
    <div className='login-fundal'>
    <div className='login-page'>
        <button onClick={cancelLogin} className='cancel-btn'>X</button>
        <p>Login</p>
        <form>
        <input type='email' placeholder='email' value={email} onChange={e => setEmail(e.target.value)}></input>
        <input type='password' placeholder='password' value={password}  autoComplete='password' onChange={e => setPassword(e.target.value)}></input> 
        </form>
        {error && <p className='error-validation' >{error}</p>}
        <button className='login-btn' onClick={handleLoginClick}>Conectare</button>
        <br></br>
        <button className='auth-btn' onClick={handleAuthClick}>Nu ai cont? Înregistrează-te!</button>
       
       
    </div>
   
    </div>
 );

}

export default LoginForm;