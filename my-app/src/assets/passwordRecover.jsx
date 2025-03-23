import React from 'react';
import './passwordRecoverStyle.css';

export function PasswordRecover() {
    return (
        <>
            <div className="container">
                <form className="password-form">
                    <h1 id="title-password">Introduce new password</h1>

                    <div className="input-group">
                        <label>New Password</label>
                        <input className="passwordblock" type="password" name="password" placeholder="Enter password" required />
                    </div>

                    <div className="input-group">
                        <label>Confirm Your New Password</label>
                        <input className="passwordblock" type="password" name="confirmPassword" placeholder="Repeat the password" required />
                    </div>

                    <button id="passwordButton" type="submit">Change Password</button>


                </form>
            </div>

            {/* Espacio reservado para el footer */}
            <div className="footer-space"></div>
        </>
    );
}
