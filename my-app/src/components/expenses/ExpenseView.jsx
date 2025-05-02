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

                // Check for non-JSON or error response
                const text = await response.text();
                try {
                    const data = JSON.parse(text);
                    setExpenses(data);
                } catch (parseError) {
                    console.error("Error parsing JSON:", parseError);
                    console.error("Server returned:", text);
                }

            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        }

        if (id) {
            fetchExpenses();
        }
    }, [id]);

    const handleContribute = (expenseId) => {
        setExpenses(prevExpenses =>
            prevExpenses.map(expense =>
                expense.id === expenseId ? { ...expense, covered: true } : expense
            )
        );
        // TODO: Send update to server
    };

    const handleEdit = (expenseId) => {
        console.log("Editar gasto:", expenseId);
        // TODO: Navigate or show modal to edit
    };

    const handleDelete = (expenseId) => {
        setExpenses(prevExpenses =>
            prevExpenses.filter(expense => expense.id !== expenseId)
        );
        // TODO: Send delete request to server
    };

    const totalExpense = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

    return (
        <div className="expense-wrapper">
            <Header/>

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
                    {expenses.map(expense => (
                        <div key={expense.id} className={expense.covered ? "covered-expense" : "pending-expense"}>
                            <div className="name-expense">
                                <h5 className="color-expense gap-tag">{expense.name}</h5>
                            </div>
                            <div className="amount-expense">
                                <h5 className="color-expense gap-tag">Amount: {expense.amount.toFixed(2)}€</h5>
                            </div>
                            {!expense.covered ? (
                                <div className="contribute-expense gap-tag">
                                    <button onClick={() => handleContribute(expense.id)}>Contribute</button>
                                </div>
                            ) : (
                                <div>
                                    <h5 className="color-expense gap-tag">Cubierto</h5>
                                </div>
                            )}
                            <div className="edition-expense gap-tag">
                                <button onClick={() => handleEdit(expense.id)}>Editar</button>
                            </div>
                            <div className="delete-expense gap-tag">
                                <button onClick={() => handleDelete(expense.id)}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="expense-list-button" onClick={() => navigate(`/AñadirGastos/${id}`)}>
                    <h2 className="color-expense">Añadir Gasto</h2>
                </button>
            </div>

            <Footer/>
        </div>
    );
}
