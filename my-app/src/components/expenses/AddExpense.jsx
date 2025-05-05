import React, { useState, useEffect } from "react";
import './AddExpense.css';
import { useNavigate, useParams, useLocation } from "react-router-dom";

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
    const [contributorID, setContributorID] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();  // Para obtener el estado pasado desde la página de edición
    const expenseToEdit = location.state?.expense;  // Obtenemos el gasto que estamos editando, si existe

    const token = localStorage.getItem('token');

    async function handleError(errorResponse) {
        const errorBody = await errorResponse.json();
        alert(errorBody.error);
        if (errorResponse.status === 403) {
            localStorage.removeItem('token');
            navigate("/IniciarSesion");
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:3000/auth/my-information', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setContributorID(data.id); // Asegúrate de que el campo sea 'id' en tu backend
                } else {
                    await handleError(response);
                }
            } catch (error) {
                console.error("Network error al obtener el usuario:", error);
                alert("Error de red al obtener el usuario.");
            }
        };

        fetchUser();

        // Si estamos editando un gasto, cargamos sus datos en los campos del formulario
        if (expenseToEdit) {
            setTitle(expenseToEdit.title);
            setAmount(expenseToEdit.amount);
            setSelectedType(expenseToEdit.tags[0] || '');  // Asumimos que el tipo está en las etiquetas (tags)
        }
    }, [expenseToEdit, token]);

    const handleSubmit = async () => {
        if (!title || !amount) {
            const missingFields = [];
            if (!amount) missingFields.push("amount");
            if (!title) missingFields.push("title");
            alert(`Faltan campos requeridos: ${missingFields}`);
            return;
        }

        const newExpense = {
            title: title,
            amount: parseFloat(amount),
            tags: [selectedType],
        };

        try {
            let response;

            // Si estamos editando un gasto, actualizamos
            if (expenseToEdit) {
                response = await fetch(`http://localhost:3000/groups/${id}/expenses/${expenseToEdit.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(newExpense),
                });
            } else {
                // Si estamos añadiendo un nuevo gasto
                response = await fetch(`http://localhost:3000/groups/${id}/expenses`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(newExpense),
                });
            }

            if (response.ok) {
                navigate(`/Gastos/${id}`);
                console.log("Gasto guardado correctamente.");
            } else {
                await handleError(response);
                return;
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert('Error de red al enviar el gasto.');
        }
    };

    return (
        <div className="group-container">
            <div className="group-header">
                <h2>{expenseToEdit ? "Editar Gasto" : "Añadir Gasto"}</h2>
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
                            <option key={key} value={value}>{value}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="group-footer">
                <button className="submit-button-add-group" onClick={handleSubmit}>
                    {expenseToEdit ? "Actualizar Gasto" : "Añadir Gasto"}
                </button>
                <button className="cancel-button-add-group" onClick={() => navigate(`/Gastos/${id}`)}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default AddExpense;
