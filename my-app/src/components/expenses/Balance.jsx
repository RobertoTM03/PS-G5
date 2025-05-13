import React from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";
import './Balance.css'; // Reutilizamos estilos

export default function Balance() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Datos de ejemplo estáticos
    const toCover = [
        { name: "Ana", amount: 15.50 },
        { name: "Carlos", amount: -22.00 }, // Ejemplo negativo
        { name: "Elena", amount: 8.75 },
        { name: "David", amount: -10.20 }, // Ejemplo negativo
        { name: "Sofía", amount: 5.80 },
        { name: "Javier", amount: -18.90 }, // Ejemplo negativo
        { name: "Lucía", amount: 12.35 },
    ];

    return (
        <div>
            <Header />
            <div className="main-container-balance">

                <div className="arrow-balance" onClick={() => navigate(`/GroupAdminView/${id}`)}>←</div>
                <div className="balance-navigation">
                    <button className="balance-nav-button" onClick={() => navigate(`/Gastos/${id}`)}>Gastos</button>
                    <button className="balance-nav-button active">Balance</button>
                </div>

                <div className="balance-details">
                    <h2>Mi Balance</h2>
                    <h3>Por Cubrir:</h3>
                    <div className="balance-table">
                        <div className="balance-header">
                            <span className="balance-header-item">Nombre</span>
                            <span className="balance-header-item">Cantidad</span>
                        </div>
                        {toCover.length > 0 ? (
                            toCover.map((item, index) => (
                                <div key={index} className="balance-row">
                                    <span className="balance-item name-item"><h5 className="color-expense">{item.name}</h5></span>
                                    <span className={`balance-item amount-item ${item.amount < 0 ? 'negative-amount' : 'positive-amount'}`}>
                                        <h5>{item.amount.toFixed(2)}€</h5>
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p>No hay importes pendientes por cubrir.</p>
                        )}
                    </div>
                </div>

            </div>
            <Footer />
        </div>

    );
}