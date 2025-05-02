import React, { useState } from "react";
import './AddExpense.css';
import { useNavigate, useParams } from "react-router-dom";

const ExpenseType = {
    RESTAURANT: 'Comida',
    TRANSPORT: 'Transporte',
    FESTIVAL: 'Festival',
    PROVISIONES: 'Provisiones',
    ROPA: 'Ropa',
    MISCELÁNEOS: 'Misceláneos',
};

const AddExpense = () => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const token = localStorage.getItem('token'); // o ajústalo según tu app

    const handleSubmit = async () => {
        if (!title || !amount || !selectedType) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const newExpense = {
            name: title,
            amount: parseFloat(amount),
            contributorID: token,
            tags: [selectedType], // solo el tipo de gasto como etiqueta
        };

        try {
            const response = await fetch(`http://localhost:3000/groups/${id}/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newExpense)
            });


            if (response.ok) {
                navigate(`/Gastos/${id}`);
            } else {
                const errorText = await response.text();
                console.error('Error creating expense:', errorText);
                alert('Error al crear el gasto.');
            }
        } catch (error) {
            console.error("Network error:", error);
            alert('Error de red al enviar el gasto.');
        }
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-label">
                    <label>Importe</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-input"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <div className="form-label">
                    <label>Tipo de gasto</label>
                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                        <option value="" disabled>Selecciona un tipo</option>
                        {Object.entries(ExpenseType).map(([key, value]) => (
                            <option key={key} value={value}>{value}</option> // usamos el valor como etiqueta
                        ))}
                    </select>
                </div>
            </div>
            <div className="group-footer">
                <button className="submit-button-add-group" onClick={handleSubmit}>
                    Añadir gasto
                </button>
                <button className="cancel-button-add-group" onClick={() => navigate(`/Gastos/${id}`)}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default AddExpense;
