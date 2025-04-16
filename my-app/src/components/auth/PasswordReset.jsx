import React, { useState } from 'react';
import { useSearchParams } from "react-router"
import './PasswordReset.css';
import "../../styles.css";
import HeaderNoSigned from '../layout/HeaderNoSigned.jsx';
import Footer from '../layout/Footer.jsx';

export default function PasswordReset() {

    const [searchParams, setSearchParams] = useSearchParams();

    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [oobCodeEpired, setOobCodeEpired] = useState(false);
    const [passwordChangeFailed, setPasswordChangeFailed] = useState(false);

    
    function handlePasswordChange(e) {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordsMatch(newPassword === confirmedPassword);
    }
    function handleConfirmedPasswordChange(e) {
        const newConfirmedPassword = e.target.value;
        setConfirmedPassword(newConfirmedPassword);
        setPasswordsMatch(password === newConfirmedPassword);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsFormSubmitted(true);
        console.log(password);
        console.log(confirmedPassword);
        console.log(passwordsMatch);

        
    };

    return (
        <div className="recover-page-container">
            <HeaderNoSigned />
            <div className="content">
                <form className="password-form" onSubmit={handleSubmit}>
  <h1 id="title-password">Introduce nueva contraseña</h1>

  <div className="input-group">
      <label>Nueva contraseña</label>
      <input
          className="passwordblock"
          type="password"
          name="password"
          onChange={handlePasswordChange}
          placeholder="Enter password"
          required
      />
  </div>

  <div className="input-group">
      <label>Confirma la nueva contraseña</label>
      <input
          className="passwordblock"
          type="password"
          name="confirmedPassword"
          onChange={handleConfirmedPasswordChange}
          placeholder="Repeat the password"
          required
      />
  </div>
  <span className={`${passwordChanged ? "" : "hidden "}form-submit form-submit-success`}>
  ¡Tu contraseña se ha cambiado correctamente!
</span>

<span className={`${!passwordsMatch && isFormSubmitted && !passwordChanged && !passwordChangeFailed ? "" : "hidden "}form-submit form-submit-error`}>
  ¡Las contraseñas no coinciden!
</span>

<span className={`${oobCodeEpired ? "" : "hidden "}form-submit form-submit-error`}>
  El código para restablecer la contraseña ha expirado. Por favor, solicita un nuevo restablecimiento.
</span>

<span className={`${passwordChangeFailed ? "" : "hidden "}form-submit form-submit-error`}>
  Ha ocurrido un error. Intenta nuevamente más tarde.
</span>

<button id="passwordButton" type="submit" className={`${passwordChanged || oobCodeEpired || passwordChangeFailed ? "disabled " : ""}confirm-button`}>
  Cambiar contraseña
</button>
                </form>
            </div>
            <Footer />
        </div>
    );
}
