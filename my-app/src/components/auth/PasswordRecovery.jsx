import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles.css";
import "./PasswordRecovery.css";

import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";

import {useFirebase} from "../../Firebase.jsx";
import { sendPasswordResetEmail } from "firebase/auth";

export default function PasswordRecovery () {

  const { auth } = useFirebase();
  const [email, setEmail] = useState("");
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  async function handleSubmit() {
    await sendPasswordResetEmail(auth, email);
    setIsRequestSubmitted(true);
  }

  return (
    <div className="reset-password-container">
      <Header />
      <div className="reset-password-box">
        <h1>Resetear contraseña</h1>
        <p>
        Introduce tu dirección de correo electrónico para recibir un enlace de restablecimiento de contraseña.        </p>
        <form action={handleSubmit}>
          <input
            type="email"
            onChange={handleEmailChange}
            placeholder="Introduce tu correo electrónico"
            required
          />
          <span className={`${isRequestSubmitted? "":"hidden "}form-submit form-submit-success`}>
          Si el correo existe, recibirás un mensaje con instrucciones.          </span>
          <button type="submit" className={`${isRequestSubmitted? "disabled ":""}confirm-button`}>
          Confirmar correo electrónico          </button>
        </form>
        <p className="go-to-login">
          ir a <Link to="/IniciarSesion">inicio  de sesión</Link>
        </p>
      </div>
      <Footer />
    </div>
  );
};