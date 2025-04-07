import React, { useState } from "react";
import "../CSS/PasswordRecovery.css";
import Footer from "./Footer.jsx";
import { Link } from "react-router-dom";
import HeaderNoSigned from "./HeaderNoSigned.jsx";

import {useFirebase} from "./Firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function PasswordRecovery () {

  const { auth } = useFirebase();
  const [email, setEmail] = useState("");
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);

  function handleEmailChange(e) {
    setEmail(e.target.value);
  };

  async function handleSubmit() {
    console.log(`Sending email to ${email}`);
    await sendPasswordResetEmail(auth, email);
    setIsRequestSubmitted(true);
  };

  return (
    <div className="reset-password-container">
      <HeaderNoSigned />
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