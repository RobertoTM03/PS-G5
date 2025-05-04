import React, { useState, useEffect } from "react";
import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";
import './ExpenseView.css';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

export default function ExpenseView() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [expenses, setExpenses] = useState([]);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const token = localStorage.getItem('token');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);

    useEffect(() => {
        if (!token) {
            console.log('No hay token, redirigiendo a la página de inicio de sesión');
            navigate('/login'); // Redirige al login si no hay token
        } else {
            fetchUserName();
            fetchExpenses();
        }
    }, [token, navigate]);

    async function fetchExpenses() {
        try {
            const response = await fetch(`http://localhost:3000/groups/${id}/expenses/`, {
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.log("No autorizado. El token puede estar expirado.");
                    navigate('/login'); // Redirige al login si el token es inválido
                    return;
                }
                setExpenses([]);
                return;
            }

            const data = await response.json();
            setExpenses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al obtener los gastos:", error);
            setExpenses([]);
        }
    }

    async function fetchUserName() {
        try {
            const response = await fetch('http://localhost:3000/auth/my-information', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                console.log("USER", data.name, data.id);
                setUserName(data.name);
                setUserId(data.id);
            } else {
                console.error('Error al obtener el nombre del usuario');
                if (response.status === 401) {
                    navigate('/login'); // Redirige si no está autorizado
                }
            }
        } catch (error) {
            console.error('Error al obtener el nombre del usuario:', error);
        }
    }

    // Función para manejar la contribución
    const handleContribute = async (expenseId) => {
        if (!userName) {
            console.error("El nombre del usuario no está disponible");
            return;
        }

        const expense = expenses.find(expense => expense.id === expenseId);

        if (expense && expense.contributor) {
            console.error("Este gasto ya está cubierto, no puedes contribuir.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/groups/${id}/expenses/${expenseId}/contribute`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.log("No autorizado. El token puede estar expirado.");
                    navigate('/login');
                    return;
                }
                const errorText = await response.text();
                throw new Error(`Error al contribuir al gasto: ${response.status} - ${errorText}`);
            }

            // Actualiza solo el gasto modificado
            setExpenses(prevExpenses =>
                prevExpenses.map(expense =>
                    expense.id === expenseId
                        ? { ...expense, contributor: {id: userId, name: userName} }
                        : expense
                )
            );

        } catch (error) {
            console.error("Error al contribuir al gasto:", error.message);
        }
    };

    // Función para manejar la retirada de contribución
    const handleUncontribute = async (expenseId) => {
        try {
            const response = await fetch(`http://localhost:3000/groups/${id}/expenses/${expenseId}/remove-contribution`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.log("No autorizado. El token puede estar expirado.");
                    return;
                }
                throw new Error(`Error al quitar la contribución: ${response.status}`);
            }

            // Actualiza solo el gasto modificado
            setExpenses(prevExpenses =>
                prevExpenses.map(expense =>
                    expense.id === expenseId
                        ? { ...expense, contributor: false, contributorName: null }
                        : expense
                )
            );

        } catch (error) {
            console.error("Error al quitar la contribución:", error);
        }
    };

    const handleEdit = (expenseId) => {
        const expenseToEdit = expenses.find(expense => expense.id === expenseId);
        if (!expenseToEdit) return;

        navigate(`/AñadirGastos/${id}`, {
            state: { expense: expenseToEdit }
        });
    };

    const handleDeleteClick = (expenseId) => {
        setExpenseToDelete(expenseId);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/groups/${id}/expenses/${expenseToDelete}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.log("No autorizado. El token puede estar expirado.");
                    navigate('/login');
                    return;
                }
                throw new Error(`Error al eliminar gasto: ${response.status}`);
            }

            setExpenses(prev => prev.filter(expense => expense.id !== expenseToDelete));
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error eliminando gasto:", error);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    // Calcular el total de los gastos
    const totalExpense = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

    return (
        <div className="main-container">
            <Header />

            <div className="expense-overwiew">
                <h2 className="color-expense">Resumen de gastos:</h2>
                <div className="expense-calculation">
                    <div className="expense-calculation-text">
                        <h3 className="color-expense">Gasto Total:</h3>
                    </div>
                    <div className="expense-calculation-display">
                        <h3 className="color-expense">{totalExpense.toFixed(2)}€</h3>
                    </div>
                </div>
            </div>

            <div className="expense-list">
                <div className="expense-list-text">
                    <h2 className="color-expense">Lista de gastos:</h2>
                </div>

                <div className="expense-list-display">
                    <div className="expense-table-header">
                        <span>Título</span>
                        <span>Cantidad</span>
                        <span>Acción</span>
                        <span>Contribuido por</span>
                        <span>Editar/Eliminar</span>
                    </div>

                    {expenses.length > 0 ? (
                        expenses.map(expense => (
                            <div key={expense.id} className={`expense-row ${expense.contributor ? "covered-expense" : "pending-expense"}`}>
                                <div className="name-expense">
                                    <h5 className="color-expense">{expense.title}</h5>
                                    {expense.contributor && <span className="expense-label covered-expense-label">Cubierto</span>}
                                    {!expense.contributor && <span className="expense-label">Pendiente</span>}
                                </div>

                                <div className="amount-expense">
                                    <h5 className="color-expense">{expense.amount.toFixed(2)}€</h5>
                                </div>

                                <div className="contribute-expense">
                                { expense.contributor ? 
                                    (
                                        expense.contributor.id === userId ? (
                                            <div className="contribution-info">
                                                <button className="uncontribute-button-red" onClick={() => handleUncontribute(expense.id)}>
                                                    Desvincular
                                                </button>
                                            </div>
                                        ) : null
                                    ) : (
                                            <button className="contribute-button-green" onClick={() => handleContribute(expense.id)}>
                                                Cubrir
                                            </button>
                                    )
                                }
                                </div>



                                <div className="contributed-by">
                                    {expense.contributor && (
                                        <span className="contributor-name">{expense.contributor.name}</span>
                                    )}
                                </div>

                                <div className="edition-expense">
                                    <button onClick={() => handleEdit(expense.id)} className="edit-btn">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDeleteClick(expense.id)} className="delete-btn">
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-expenses">No hay gastos registrados.</p>
                    )}
                </div>

                <div className="expense-list-bottom">
                    <button className="expense-list-button" onClick={() => navigate(`/AñadirGastos/${id}`)}>
                        <h2 className="color-expense">Añadir Gasto</h2>
                    </button>
                </div>
            </div>

            {showDeleteModal && (
                <div className="delete-modal">
                    <div className="modal-content">
                        <h3>¿Estás seguro de que deseas eliminar este gasto? 😟</h3>
                        <p>Una vez eliminado, no podrás recuperarlo. ¡Piensa bien tu decisión!</p>
                        <div className="modal-actions">
                            <button className="cancel-button" onClick={handleCancelDelete}>Cancelar</button>
                            <button className="confirm-button" onClick={handleDelete}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
