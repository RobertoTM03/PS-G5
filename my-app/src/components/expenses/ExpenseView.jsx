import React, { useState, useEffect } from "react";
import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";
import './ExpenseView.css';
import { useNavigate } from 'react-router-dom';

export default function ExpenseView() {
    const navigate = useNavigate();

    const [expenses, setExpenses] = useState([]);

    // Fetch a servidor al montar el componente
    useEffect(() => {
        async function fetchExpenses() {
            try {
                const response = await fetch(``);
                const data = await response.json();
                setExpenses(data); // Aquí ya tienes tu array de gastos
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        }

        fetchExpenses();
    }, []);

    const handleContribute = (id) => {
        setExpenses(prevExpenses =>
            prevExpenses.map(expense =>
                expense.id === id ? { ...expense, covered: true } : expense
            )
        );
        // Aquí también podrías hacer un POST/PATCH al servidor para actualizar estado
    };

    const handleEdit = (id) => {
        console.log("Editar gasto:", id);
        // lógica para editar
    };

    const handleDelete = (id) => {
        setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
        // También llamarías al servidor para eliminar
    };

    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <div className="expense-wrapper">
            <Header/>

            <div className="previous-page-expense">
                <button className="arrow" onClick={() => navigate('/GroupAdminView/')}>
                    <i className="fa-solid fa-arrow-left icon-black"></i>
                </button>
                <div className="text-prev-page">
                    <h2 className="color-expense">Gastos</h2>
                </div>
            </div>

            <div className="expense-overwiew">
                <h3 className="color-expense">Resumen de gastos:</h3>
                <div className="expense-calculation">
                    <div className="expense-calculation-text">
                        <h2 className="color-expense">Gasto Total:</h2>
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

                <button className="expense-list-button" onClick={() => navigate('/AñadirGastos')}>
                    <h2 className="color-expense">Añadir Gasto</h2>
                </button>
            </div>

            <Footer/>
        </div>
    );
}
