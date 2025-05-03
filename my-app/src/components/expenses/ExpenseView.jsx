import React, { useState, useEffect } from "react";
import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";
import './ExpenseView.css';
import { useNavigate, useParams } from 'react-router-dom';

export default function ExpenseView() {
    const navigate = useNavigate();
    const { id } = useParams(); // groupId
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        async function fetchExpenses() {
            try {
                const response = await fetch(`http://localhost:3000/group/${id}/expenses/`);

                if (!response.ok) {
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

        if (id) {
            fetchExpenses();
        }
    }, [id]);

    const handleContribute = async (expenseId) => {
        try {
            const response = await fetch(`http://localhost:3000/group/${id}/expenses/${expenseId}/contribute`, {
                method: 'POST'
            });

            if (!response.ok) throw new Error(`Error al contribuir al gasto: ${response.status}`);

            setExpenses(prev =>
                prev.map(expense =>
                    expense.id === expenseId ? { ...expense, covered: true } : expense
                )
            );
        } catch (error) {
            console.error("Error al contribuir al gasto:", error);
        }
    };

    const handleUncontribute = async (expenseId) => {
        try {
            const response = await fetch(`http://localhost:3000/group/${id}/expenses/${expenseId}/remove-contribution`, {
                method: 'POST'
            });

            if (!response.ok) throw new Error(`Error al quitar la contribución: ${response.status}`);

            setExpenses(prev =>
                prev.map(expense =>
                    expense.id === expenseId ? { ...expense, covered: false } : expense
                )
            );
        } catch (error) {
            console.error("Error al quitar la contribución:", error);
        }
    };

    const handleEdit = async (expenseId) => {
        const expenseToEdit = expenses.find(e => e.id === expenseId);
        if (!expenseToEdit) return;

        const updatedData = {
            name: expenseToEdit.name + " (editado)",
            amount: expenseToEdit.amount + 10,
            contributorID: expenseToEdit.contributorID || "defaultUser",
            tags: expenseToEdit.tags || []
        };

        try {
            const response = await fetch(`http://localhost:3000/group/${id}/expenses/${expenseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) throw new Error(`Error al actualizar gasto: ${response.status}`);

            const updatedExpense = await response.json();

            setExpenses(prev =>
                prev.map(expense =>
                    expense.id === expenseId ? updatedExpense : expense
                )
            );
        } catch (error) {
            console.error("Error actualizando gasto:", error);
        }
    };

    const handleDelete = async (expenseId) => {
        try {
            const response = await fetch(`http://localhost:3000/group/${id}/expenses/${expenseId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`Error al eliminar gasto: ${response.status}`);

            setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
        } catch (error) {
            console.error("Error eliminando gasto:", error);
        }
    };

    const totalExpense = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

    return (
        <div className="expense-wrapper">
            <Header />

            <div className="previous-page-expense">
                <div className="text-prev-page">
                    <h1 className="color-expense">Gastos</h1>
                </div>
            </div>

            <div className="expense-overwiew">
                <h2 className="color-expense">Resumen de gastos:</h2>
                <div className="expense-calculation">
                    <div className="expense-calculation-text">
                        <h3 className="color-expense">Gasto Total:</h3>
                    </div>
                    <div className="expense-calculation-display">
                        <h2 className="color-expense">{totalExpense.toFixed(2)}€</h2>
                    </div>
                </div>
            </div>

            <div className="expense-list">
                <div className="expense-list-text">
                    <h2 className="color-expense">Lista de gastos:</h2>
                </div>

                <div className="expense-list-display">
                    {expenses.length > 0 ? (
                        expenses.map(expense => (
                            <div key={expense.id} className={expense.covered ? "covered-expense" : "pending-expense"}>
                                <div className="name-expense">
                                    <h5 className="color-expense gap-tag">{expense.name}</h5>
                                </div>
                                <div className="amount-expense">
                                    <h5 className="color-expense gap-tag">Amount: {expense.amount.toFixed(2)}€</h5>
                                </div>
                                <div className="contribute-expense gap-tag">
                                    {!expense.covered ? (
                                        <button className="contribute-button" onClick={() => handleContribute(expense.id)}>
                                            Contribute
                                        </button>
                                    ) : (
                                        <button className="uncontribute-button" onClick={() => handleUncontribute(expense.id)}>
                                            Uncontribute
                                        </button>
                                    )}
                                </div>
                                <div className="edition-expense gap-tag">
                                    <button onClick={() => handleEdit(expense.id)}>Editar</button>
                                </div>
                                <div className="delete-expense gap-tag">
                                    <button onClick={() => handleDelete(expense.id)}>Eliminar</button>
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
