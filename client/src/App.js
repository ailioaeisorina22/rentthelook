import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { useEffect, useState } from "react";
import HomePage from './components/HomePage.js';
import LoginForm from './components/LoginForm.js';
import AuthForm from './components/AuthForm.js';
import Page from './components/Page.js';
import ProductsPage from './components/ProductsPage.js';
import CartPage from './components/CartPage.js';
import Profile from './components/Profile.js';
import ProductPage from './components/ProductPage.js';
import ProtectedRoute from './components/ProtectedRoute';
import Checkout from './components/Checkout.js';
import Succes from './components/Success.js';
import Declined from './components/Declined.js';

import AdminDashboard from './components/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import AdminReports from './components/AdminReports.js';

const App = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');
      if (token) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
      setIsAdmin(role === "ADMIN");
    }, []);
    return (
      <Router>
        <Routes>
        {isAdmin ?(   
          <>     
          <Route path="/admin/dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />

          <Route path="/:uid/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </>    
          ) : (
          <>
          <Route path="/:uid/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/" element={<HomePage/>} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path='/login' element={<LoginForm setIsAuth={setIsAuth} setIsAdmin={setIsAdmin}/>}/>
          <Route path='/auth' element={<AuthForm/>}/>
          <Route path="/women" element={<Page/>}/>
          <Route path="/men" element={<Page/>}></Route>
          <Route path="/kids" element={<Page/>}></Route>
          <Route path="/women/clothes" element={<ProductsPage/>}></Route>
          <Route path="/women/shoes" element={<ProductsPage/>}></Route>
          <Route path="/women/accs" element={<ProductsPage/>}></Route>
          <Route path="/men/clothes" element={<ProductsPage/>}></Route>
          <Route path="/men/shoes" element={<ProductsPage/>}></Route>
          <Route path="/men/accs" element={<ProductsPage/>}></Route>
          <Route path="/kids/clothes" element={<ProductsPage/>}></Route>
          <Route path="/kids/shoes" element={<ProductsPage/>}></Route>
          <Route path="/kids/accs" element={<ProductsPage/>}></Route>
          <Route path="/cart" element={<ProtectedRoute ><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute ><Checkout /></ProtectedRoute>} />
          <Route path="/:gender/:category/:pid" element={<ProductPage/>}></Route>
          <Route path="/success" element={<Succes/>}></Route>
          <Route path="/declined" element={<Declined/>}></Route>
          </> )} 
          <Route path="*" element={<Navigate to={isAdmin ? "/admin/dashboard" : "/"} />} />
        </Routes>
      </Router>
  );
}

export default App;
