import React, { useEffect, useState } from "react";
import './DividedExpense.css';
import { useNavigate, useParams, useLocation } from "react-router-dom";

const DividedExpense = () => {
    const navigate = useNavigate();
    const { id: groupId } = useParams(); // este es el groupId
    const location = useLocation();
    const token = localStorage.getItem('token');

    const [contributorID, setContributorID] = useState(null);
    const [amount, setAmount] = useState(""); // para guardar el importe introducido
    const expenseId = location.state?.expenseId;

    async function handleError(errorResponse) {
        const errorBody = await errorResponse.json();
        const error = errorBody.error;
        alert(error);
        if (errorResponse.status === 403) navigate("/InicioSesion");
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
                    setContributorID(data.id);
                } else {
                    await handleError(response);
                }
            } catch (error) {
                console.error("Network error al obtener el usuario:", error);
                alert("Error de red al obtener el usuario.");
            }
        };
        fetchUser();
    }, []);

    const handleContribute = async () => {
        if (!amount || !expenseId) {
            alert("Falta el importe o el ID del gasto.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/groups/${groupId}/expenses/${expenseId}/contribute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount: parseFloat(amount)
                }),
            });

            if (response.ok) {
                alert("Contribución realizada correctamente.");
                navigate(`/Gastos/${groupId}`);
            } else {
                await handleError(response);
            }
        } catch (error) {
            console.error("Network error al contribuir al gasto:", error);
            alert("Error de red al contribuir al gasto.");
        }
    };

    return (
        <div className="divided-expense-container">
            <div className="divided-expense-header">
                <h2>Gasto Dividido</h2>
            </div>

            <div className="divided-expense-form">
                <div className="divided-expense-form-label">
                    <label>Importe</label>
                    <input
                        type="number"
                        min="0.00"
                        step="0.01"
                        className="form-input"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
            </div>

            <div className="divided-expense-group-footer">
                <button className="submit-button-add-group" onClick={handleContribute}>Añadir</button>
                <button className="cancel-button-add-group" onClick={() => navigate(`/Gastos/${groupId}`)}>Cancelar</button>
            </div>
        </div>
    );
}

export default DividedExpense;
