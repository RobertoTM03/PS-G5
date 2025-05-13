import React, { useState, useEffect, useRef } from "react";
import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";
import './ExpenseView.css';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa'; // Importa FaTimes

const ExpenseType = { // Mover ExpenseType aquí para que esté disponible en este archivo
    RESTAURANT: 'Comida',
    TRANSPORT: 'Transporte',
    FESTIVAL: 'Festival',
    PROVISIONES: 'Provisiones',
    ROPA: 'Ropa',
    MISCELÁNEOS: 'Misceláneos',
};

function FilterDropdown({ categories, onCategoryChange, onClose, selected }) {
    return (
        <div className="filter-dropdown">
            <h3>Filtrar por tipo</h3>
            {categories.map((category, index) => (
                <div key={index}>
                    <label>
                        <input
                            type="checkbox"
                            value={category}
                            checked={selected.includes(category)}
                            onChange={(e) => onCategoryChange(category, e.target.checked)}
                        />
                        {category}
                    </label>
                </div>
            ))}
            <button onClick={onClose} className="close-dropdown-button-bottom">
                <FaTimes /> Cerrar
            </button>
        </div>
    );
}

export default function ExpenseView() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [expenses, setExpenses] = useState([]);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const token = localStorage.getItem('token');
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [allCategories, setAllCategories] = useState(Object.values(ExpenseType)); // Usar ExpenseType aquí
    const filterDropdownRef = useRef(null); // Ref para el dropdown de filtro

    async function handleError(errorResponse) {
        const errorBody = await errorResponse.json();
        alert(errorBody.error);
        if (errorResponse.status === 403) {
            localStorage.removeItem('token');
            navigate("/IniciarSesion");
        }
    }

    useEffect(() => {
        if (!token) {
            console.log('No hay token, redirigiendo a la página de inicio de sesión');
            navigate('/IniciarSesion'); // Redirige al login si no hay token
        } else {
            fetchUserName();
            fetchExpenses();
        }
    }, [token, navigate, id]);


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
            // Verificar si data es un array y no es null
            const validExpenses = Array.isArray(data) ? data : [];

            // Mapear las etiquetas de strings a un array de strings
            const processedExpenses = validExpenses.map(expense => ({
                ...expense,
                tags: typeof expense.tags === 'string' ? [expense.tags] : expense.tags || [],
            }));
            setExpenses(processedExpenses);

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

            setExpenses(prevExpenses =>
                prevExpenses.map(expense =>
                    expense.id === expenseId
                        ? { ...expense, contributor: { id: userId, name: userName } }
                        : expense
                )
            );

            window.location.reload();

        } catch (error) {
            alert(`Error al contribuir al gasto: ${error.message}`);
        }
    };

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

            setExpenses(prevExpenses =>
                prevExpenses.map(expense =>
                    expense.id === expenseId
                        ? { ...expense, contributor: false, contributorName: null }
                        : expense
                )
            );

            window.location.reload();

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

            window.location.reload();
        } catch (error) {
            alert(`Error eliminando gasto: ${error.message}`);
        }
    };

    const toggleDropdown = (expenseId) => {
        console.log('toggleDropdown called for expenseId:', expenseId);
        setOpenDropdownId(prevId => {
            const newId = prevId === expenseId ? null : expenseId;
            console.log('openDropdownId is now:', newId);
            return newId;
        });
    };

    const closeDropdownManually = () => {
        setOpenDropdownId(null);
    };

    useEffect(() => {
        const handleClickOutsideTags = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutsideTags);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideTags);
        };
    }, [dropdownRef]);

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleCategoryChange = (category, isChecked) => {
        if (isChecked) {
            setSelectedCategories([...selectedCategories, category]);
        } else {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        }
    };

    const closeFilterDropdown = () => {
        setIsFilterOpen(false);
    };

    useEffect(() => {
        const handleClickOutsideFilter = (event) => {
            if (isFilterOpen && filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutsideFilter);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideFilter);
        };
    }, [isFilterOpen, filterDropdownRef]);

    const filteredExpenses = selectedCategories.length > 0
        ? expenses.filter(expense => expense.tags && expense.tags.some(tag => selectedCategories.includes(tag)))
        : expenses;

    return (
        <div className="main-container">
            <Header />
            <div className="expense-header-bar">
                <div className="arrow" onClick={() => navigate(`/GroupAdminView/${id}`)}>← </div>
                <h2 className="expense-tile-text">Gastos</h2>
            </div>

            <div className="expense-navigation">
                <div className="nav-centered">
                    <button className="balance-nav-button active">Lista de Gastos</button>
                    <button className="balance-nav-button" onClick={() => navigate(`/Balance/${id}`)}>Balance</button>
                </div>
                <div className="filter-button-container" ref={filterDropdownRef}>
                    <button className="filtrado-tipos-button styled-dropdown-header" onClick={toggleFilter}>
                        Filtrado por tipos
                    </button>
                    {isFilterOpen && (
                        <div className="filter-dropdown-container">
                            <FilterDropdown
                                categories={allCategories}
                                onCategoryChange={handleCategoryChange}
                                onClose={closeFilterDropdown}
                                selected={selectedCategories}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="expense-list">
                <div className="expense-list-display">
                    <div className="expense-table-header">
                        <span>Título</span>
                        <span>Cantidad</span>
                        <span>Acción</span>
                        <span>Pagado por</span>
                        <span>Creado por</span>
                        <span>Etiquetas</span>
                        <span>Actividad/común</span> {/* Nueva columna */}
                        <span>Ficheros asociados</span> {/* Nueva columna */}
                        <span className="edit-delete-header">Editar/Eliminar</span>
                    </div>

                    {filteredExpenses.length > 0 ? (
                        filteredExpenses.map(expense => (
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
                                    {expense.contributor ?
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
                                        )}
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

                                <div className="expense-tags-container" ref={dropdownRef}>
                                    {expense.tags && expense.tags.length > 0 ? (
                                        expense.tags.length > 1 ? (
                                            <div className="dropdown-container">
                                                <div className="custom-dropdown styled-dropdown-header" onClick={() => toggleDropdown(expense.id)}>
                                                    Etiquetas ({expense.tags.length})
                                                </div>
                                                {openDropdownId === expense.id && (
                                                    <div className="dropdown-content">
                                                        {expense.tags.map((tag, index) => (
                                                            <div key={index} className="dropdown-item">
                                                                {tag}
                                                            </div>
                                                        ))}
                                                        <button onClick={closeDropdownManually} className="close-dropdown-button-bottom">
                                                            <FaTimes /> Cerrar
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            expense.tags.map((tag, index) => (
                                                <span key={index} className="expense-tag">
                                                    {tag}
                                                </span>
                                            ))
                                        )
                                    ) : (
                                        <span className="no-tags">—</span>
                                    )}
                                </div>

                                {/* Nuevas columnas de Actividad y Almacenaje */}
                                <div className="activity-expense">
                                    <span></span> {/* Campo para Actividad */}
                                </div>
                                <div className="storage-expense">
                                    <span></span> {/* Campo para Almacenaje */}
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
                        <p className="no-expenses">{selectedCategories.length > 0 ? 'No hay gastos con estas categorías.' : 'No hay gastos registrados.'}</p>
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