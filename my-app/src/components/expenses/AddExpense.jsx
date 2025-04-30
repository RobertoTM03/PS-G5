import React, { useState } from "react";
import './AddExpense.css';
import {useNavigate} from "react-router-dom";

const ExpenseType = {
    RESTAURANT: 'Restaurante',
    TRANSPORT: 'Transporte',
    FESTIVAL: 'Festival',
    PROVISIONES: 'Provisiones',
    ROPA: 'Ropa',
    MISCELÁNEOS: 'Misceláneos',
};

const AddExpense = () => {
    const [selectedType, setSelectedType] = useState('');
    const navigate = useNavigate();
    const handleChange = (e) => {
        setSelectedType(e.target.value);
    };

    return (
        <div className="group-container">
            <div className="group-header">
                <h2>Añadir Gasto</h2>
            </div>
            <div className="group-form">
                <div className="form-label">
                    <label>Título</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Maldivas"
                    />
                </div>
                <div className="form-label">
                    <label>Importe</label>
                    <textarea className="form-textarea" placeholder="0.00"></textarea>
                </div>
                <div className="form-label">
                    <label>Tipo de gasto</label>
                    <select value={selectedType} onChange={handleChange}>
                        {Object.entries(ExpenseType).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="group-footer">
                <button className="submit-button-add-group">
                    Añadir gasto
                </button>
                <button className="cancel-button-add-group" onClick={() => navigate('/Gastos')}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default AddExpense;
