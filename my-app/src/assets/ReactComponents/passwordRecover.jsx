import React from 'react';
import '../CSS/passwordRecoverStyle.css';
import HeaderNoSigned from './HeaderNoSigned.jsx';
import Footer from './Footer.jsx';

export function PasswordRecover() {
    return (
        <div className="recover-page-container">
            <HeaderNoSigned />
            <div className="content">
                <form className="password-form">
                    <h1 id="title-password">Introduce new password</h1>

                    <div className="input-group">
                        <label>New Password</label>
                        <input
                            className="passwordblock"
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Confirm Your New Password</label>
                        <input
                            className="passwordblock"
                            type="password"
                            name="confirmPassword"
                            placeholder="Repeat the password"
                            required
                        />
                    </div>

                    <button id="passwordButton" type="submit">Change Password</button>
                </form>
            </div>
            <Footer />
        </div>
    );
}
