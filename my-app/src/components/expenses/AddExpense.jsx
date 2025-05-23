import React, { useState, useEffect } from "react";
import './AddExpense.css';
import { useNavigate, useParams, useLocation } from "react-router-dom";

const ExpenseType = {
    RESTAURANT: 'Comida',
    TRANSPORT: 'Transporte',
    FESTIVAL: 'Festival',
    PROVISIONES: 'Provisiones',
    ROPA: 'Ropa',
    MISCELANEOS: 'Misceláneos',
};

const AddExpense = () => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [contributorID, setContributorID] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const expenseToEdit = location.state?.expense;
    const [splitType, setSplitType] = useState('equal');
    const token = localStorage.getItem('token');
    const toggleType = (type) => {
        setSelectedTypes((prevTypes) =>
            prevTypes.includes(type)
                ? prevTypes.filter((t) => t !== type)
                : [...prevTypes, type]
        );
    };
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    async function handleError(errorResponse) {
        const errorBody = await errorResponse.json();
        const error = errorBody.error;
        alert(error);
        if (errorResponse.status === 403) navigate("/IniciarSesion");
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
        if (expenseToEdit) {
            setTitle(expenseToEdit.title);
            setAmount(expenseToEdit.amount);
            setSelectedTypes(expenseToEdit.tags || []);
            setSplitType(expenseToEdit.splitType || 'equal');
        } else {
            setTitle('');
            setAmount('');
            setSelectedTypes([]);
            setSplitType('equal');
        }
    }, [expenseToEdit, token, navigate, id]);

    const handleSubmit = async () => {
        if (!title.trim()) {
            alert(`Faltan campos requeridos: título.`);
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert('Por favor, introduce un importe válido y mayor que cero.');
            return;
        }



        let contributorsData;

        if (expenseToEdit) {
            contributorsData = expenseToEdit.contributors || [];
        } else {
            contributorsData = [];
        }

        const newExpense = {
            title: title,
            amount: parsedAmount,
            tags: selectedTypes,
            contributors: contributorsData,
            splitType: splitType,
        };

        try {
            let response;
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
            } else {
                await handleError(response);
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
                    <div className="dropdown-container">
                        <button
                            type="button" // Added type="button" for consistency
                            className="dropdown-button"
                            onClick={toggleDropdown}
                        >
                            Seleccionar tipos
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                {Object.entries(ExpenseType).map(([key, value]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`dropdown-item ${selectedTypes.includes(value) ? 'selected' : ''}`}
                                        onClick={() => toggleType(value)}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="group-footer">
                <button type="button" className="submit-button-add-group" onClick={handleSubmit}>
                    {expenseToEdit ? "Actualizar Gasto" : "Añadir Gasto"}
                </button>
                <button type="button" className="cancel-button-add-group" onClick={() => navigate(`/Gastos/${id}`)}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default AddExpense;