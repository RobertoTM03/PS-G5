import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/signIn.css';
import Footer from './Footer.jsx';
import Header from './HeaderNoSigned.jsx';

export default function SignIn() {
    return (
        <main className="sign-page-container">
            <Header />
            <div className="content">
                <section className="sign-box">
                    <div className="title-text">
                        <h1>Welcome back</h1>
                    </div>
                    <section className="sign-entry-form">
                        <form id="loginFormUser">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" required placeholder="Enter email address" />

                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" required placeholder="Enter password" />

                            <button type="submit" className="submit-button">Login</button>
                        </form>
                    </section>

                    <div className="bottom-text">
                        <p>
                            Don’t have an account? <Link to="/Registrarse">Sign Up</Link>
                        </p>
                        <p>
                            <Link to="/Resetear">Forgot Password?</Link>
                        </p>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}
