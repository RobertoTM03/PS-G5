import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Sobre Nosotros</h4>
            <p>FAQ</p>
            <p>¿Quiénes somos?</p>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>Email: tripcollab@gmail.com</p>
            <p>Tel: +34 612 345 678</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
