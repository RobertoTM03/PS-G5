import React, { useState } from "react";
import './AddExpense.css';

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
                        placeholder="Título"
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
                <button className="cancel-button-add-group">
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default AddExpense;
