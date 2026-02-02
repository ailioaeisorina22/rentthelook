import React, { useState } from "react";
import {useNavigate } from 'react-router-dom';
import './AuthForm.css'
import './LoginForm.css'

const AuthForm = () =>
{
    const[nume, setNume] = useState('');
    const[prenume, setPrenume] = useState('');
    const[age, setAge] = useState('');
    const[gender, setGender] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const genderList = [
        { label: "Masculin", value: "M" },
        { label: "Feminin", value: "F" },
        { label: "-", value: "-" }
    ];
    const[phone, setPhone] = useState('');
    const navigate = useNavigate();
    const [passwordInfo, setPasswordInfo] = useState(false);
    const [error, setError] = useState('');

    const cancelLogin = () => {
        navigate("/login");
    }

    const isValidPassword = (password) => {
        const minLength = password.length >= 6;
        const hasUppercase = /[A-Z]/.test(password);
        const digitCount = (password.match(/\d/g) || []).length >= 3;

        return minLength && hasUppercase && digitCount;
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleAuthClick = async (e) => {
        
        //facem apel catre backend
        e.preventDefault();
        if (!isValidEmail(email)) {
            alert("Emailul nu este valid.");
        return;
        }

        if (email !== '' && password !== '' && nume !== '' && prenume !== '' && age !== '' && phone !== '') {
            if (!isValidPassword(password)) {
                alert("Parola trebuie să conțină minim 6 caractere, o literă mare și 3 cifre!");
                return;
            }

            console.log('Email trimis:', email); 
        
            console.log(nume, prenume, age, email,password, gender); 
            try{
                const response = await fetch('http://localhost:8080/api/auth', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userLastName: nume,
                        userFirstName: prenume,
                        userAge: age,
                        email: email,
                        password: password,
                        userGender: gender,
                        phone: phone
                    })
                });

                const data = await response.json();
                if(!response.ok){
                    setError("Autentificare esuata!" + data.message);
                }else{
                    navigate("/login");
                }

            }catch(err){
                setError(err.message);
            }
        }
         else {  
            setError("Completați câmpurile pentru a vă putea autentifica!");
            return ;
        }
        
    }
    return <div className="login-fundal">
        <div className="login-page">
        <button onClick={cancelLogin} className='cancel-btn'>X</button>
        <p>Creează cont</p>
        <form>
        <input type='text' placeholder='Nume' value={nume} onChange={e => setNume(e.target.value)}></input>
        <input type='text' placeholder='Prenume' value={prenume} onChange={e => setPrenume(e.target.value)}></input>
        <input type='number' placeholder='Vârsta' value={age} min="14" onChange={e => setAge(e.target.value)}></input>
        <input type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}></input>
        <input type='password' placeholder='Parola' autoComplete='password' value={password} onFocus={()=>setPasswordInfo(true)} onBlur={()=>setPasswordInfo(false)} onChange={e => setPassword(e.target.value)}></input>

        {passwordInfo && (<div className="pssw-info">
                Parola trebuie să conțină minim 6 litere (minim o literă mare) și minim 3 cifre!!!
            </div>)
        }
        <input type='text' placeholder='Telefon' value={phone} onChange={e => setPhone(e.target.value)}></input>
        </form>
        <div className="list-gender">
           <p>Gen:</p>
            <select className="list-gender-select" value={gender} onChange={e => setGender(e.target.value)}>
            {genderList.map((g) => (
            <option key={g.value} value={g.value}>
            {g.label}
            </option>
            ))}
            </select>
        </div>
        {error && <p className='error-validation' style={{top: "80%"}}>{error}</p>}
        <button className="login-btn" onClick={handleAuthClick} style={{marginBottom: 20, fontSize: 18}}>Autentificare</button>
        </div>
    </div>
}

export default AuthForm;