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
        <h1>Reset password</h1>
        <p>
          Enter your user account's verified email address and we will send you
          a password reset link:
        </p>
        <form action={handleSubmit}>
          <input
            type="email"
            onChange={handleEmailChange}
            placeholder="Enter email address"
            required
          />
          <span className={`${isRequestSubmitted? "":"hidden "}form-submit form-submit-success`}>
            If the account exists you will receive a email soon
          </span>
          <button type="submit" className={`${isRequestSubmitted? "disabled ":""}confirm-button`}>
            Confirm Email Address
          </button>
        </form>
        <p className="go-to-login">
          Go to <Link to="/IniciarSesion">Login</Link>
        </p>
      </div>
      <Footer />
    </div>
  );
};