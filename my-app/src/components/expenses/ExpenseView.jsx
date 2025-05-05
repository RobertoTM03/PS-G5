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

    async function handleError(errorResponse) {
        const errorBody = await errorResponse.json();
        const error = errorBody.error;
        alert(error);
        if (errorResponse.status === 403) navigate("/InicioSesion");
    }

    useEffect(() => {
        if (!token) {
            console.log('No hay token, redirigiendo a la página de inicio de sesión');
            navigate('/IniciarSesion'); // Redirige al login si no hay token
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
                await handleError(response);
                setExpenses([]);
                return;
            }

            const data = await response.json();
            setExpenses(Array.isArray(data) ? data : []);
        } catch (error) {
            alert(`Error al obtener los gastos: ${error}`);
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
                setUserName(data.name);
                setUserId(data.id);
            } else {
                await handleError(response);
                return;
            }
        } catch (error) {
            alert(`Error al obtener el nombre del usuario: ${error}`);
            return;
        }
    }

    // Función para manejar la contribución
    const handleContribute = async (expenseId) => {
        if (!userName) {
            alert("El nombre del usuario no está disponible");
            return;
        }

        const expense = expenses.find(expense => expense.id === expenseId);

        if (expense && expense.contributor) {
            alert("Este gasto ya está cubierto, no puedes contribuir.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/groups/${id}/expenses/${expenseId}/contribute`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include'
            });

            if (!response.ok) {
                await handleError(response);
                return;
            }

            // Actualiza solo el gasto modificado
            setExpenses(prevExpenses =>
                prevExpenses.map(expense =>
                    expense.id === expenseId
                        ? { ...expense, contributor: {id: userId, name: userName} }
                        : expense
                )
            );
            window.location.reload();

        } catch (error) {
            alert(`Error al contribuir al gasto: ${error.message}`);
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
                await handleError(response);
                return;
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
            alert(`Error al quitar la contribución: ${error.message}`);
        }
    };

    const handleEdit = (expenseId) => {
        const expenseToEdit = expenses.find(expense => expense.id === expenseId);
        if (!expenseToEdit) return;

        navigate(`/AñadirGastos/${id}`, {
            state: { expense: expenseToEdit }
        });
    };

    const handleDeleteClick = async (expenseId) => {
        const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer.");
        
        if (!isConfirmed) return;
    
        try {
            const response = await fetch(`http://localhost:3000/groups/${id}/expenses/${expenseId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include'
            });
            if (!response.ok) {
                await handleError(response);
                return;
            }
    
            // Recargar la página después de eliminar
            window.location.reload();
    
        } catch (error) {
            alert(`Error eliminando gasto: ${error.message}`);
        }
    };
    

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/groups/${id}/expenses/${expenseToDelete}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include'
            });

            if (!response.ok) {
                await handleError(response);
                return;
            }

            setExpenses(prev => prev.filter(expense => expense.id !== expenseToDelete));
            setShowDeleteModal(false);
        } catch (error) {
            alert(`Error eliminando gasto: ${error.message}`);
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
            <div className="arrow" onClick={() => navigate(`/GroupAdminView/${id}`)}>←</div>
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
                        <span>Pagado por</span>
                        <span>Creado por</span>
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
                                                Pagado
                                            </button>
                                    )
                                }
                                </div>



                                <div className="contributed-by">
                                    {expense.contributor && (
                                        <span className="contributor-name">{expense.contributor.name}</span>
                                    )}
                                </div>

                                <div className="contributed-by">
                                    {expense.author && (
                                        <span className="contributor-name">{expense.author.name}</span>
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

            <Footer />
        </div>
    );
}
