import React from "react";
import "../CSS/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Sobre Nosotros</h4>
          <p>FAQ</p>
          <p>Quienes somos?</p>
        </div>
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>Email: namesurname@gmail.com</p>
          <p>Tel: +34 12345678</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
