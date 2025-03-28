import React, { useState } from 'react';
import "../CSS/ResetearContraseña.css";
import Footer from "./Footer.jsx";
import { Link } from 'react-router-dom';
import HeaderNoSigned from './HeaderNoSigned.jsx';

const ResetPassword = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email enviado a: ", email);
  };

  return (
    <div className="reset-password-container">
      <HeaderNoSigned/>
      <div className="reset-password-box">
        <h1>Reset password</h1>
        <p>Enter your user account's verified email address and we will send you a password reset link:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email address"
            required
          />
          <button type="submit" className="confirm-button">Confirm Email Address</button>
        </form>
        <p className="go-to-login">
          Go to <Link to="/IniciarSesion">Login</Link>
        </p>
        
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
