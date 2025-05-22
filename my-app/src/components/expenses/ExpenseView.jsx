import React, { useState, useEffect, useRef } from "react";
import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";
import './ExpenseView.css';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';

const ExpenseType = {
    RESTAURANT: 'Comida',
    TRANSPORT: 'Transporte',
    FESTIVAL: 'Festival',
    PROVISIONES: 'Provisiones',
    ROPA: 'Ropa',
    MISCELANEOS: 'Misceláneos',
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
    // Nuevo estado para indicar si el usuario logueado es el propietario/administrador del grupo
    const [isCurrentUserTheGroupOwner, setIsCurrentUserTheGroupOwner] = useState(false);
    const token = localStorage.getItem('token');
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null);
    const [openContributorDropdownId, setOpenContributorDropdownId] = useState(null);
    const contributorDropdownRef = useRef(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [allCategories,] = useState(Object.values(ExpenseType));
    const filterDropdownRef = useRef(null);
    const isCurrentUserAdmin = isCurrentUserTheGroupOwner;

    async function handleError(errorResponse) {
        const errorBody = await errorResponse.json();
        alert(errorBody.error);
        if (errorResponse.status === 403) {
            localStorage.removeItem('token');
            navigate("/IniciarSesion");
        }
    }

    const isExpenseCovered = (expense) => {
        if (!expense.contributors || expense.contributors.length === 0) {
            return false;
        }
        const totalContributions = expense.contributors.reduce((sum, contributor) => {
            return sum + (contributor.amount || 0);
        }, 0);

        return Math.abs(totalContributions - expense.amount) < 0.001;
    };

    useEffect(() => {
        if (!token) {
            navigate('/IniciarSesion');
        } else {
            fetchUserName();
            fetchGroupDetails();
        }
    }, [token, navigate]);

    useEffect(() => {
        if (id && userId) {
            fetchExpenses();
        }
    }, [id, userId]);

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


            const validExpenses = Array.isArray(data) ? data : [];
            const processedExpenses = validExpenses.map(expense => {
                const currentUserHasContributed = expense.contributors && expense.contributors.some(c => {
                    const contributorIdAsString = String(c.id);
                    const currentUserIdAsString = String(userId);
                    const match = contributorIdAsString === currentUserIdAsString;
                    return match;
                });

                return {
                    ...expense,
                    tags: typeof expense.tags === 'string' ? [expense.tags] : expense.tags || [],
                    isCovered: isExpenseCovered(expense),
                    currentUserHasContributed: currentUserHasContributed
                };
            });
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

    // Función para obtener los detalles del grupo y determinar si el usuario actual es el propietario
    async function fetchGroupDetails() {
        try {
            const response = await fetch(`http://localhost:3000/groups/${id}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.isOwner) {
                    setIsCurrentUserTheGroupOwner(true);
                } else {
                    setIsCurrentUserTheGroupOwner(false);
                }
            } else {
                await handleError(response);
            }
        } catch (error) {
            alert(`Error al obtener los detalles del grupo: ${error}`);
        }
    }

    const handleContribute = async (expenseId) => {
        navigate(`/GastosDividos/${id}`, {
            state: { expenseId: expenseId }
        });
    };

    const handleUncontribute = async (expenseId) => {
        const isConfirmed = window.confirm("¿Estás seguro de que quieres eliminar tu contribución a este gasto?");
        if (!isConfirmed) return;

        try {
            const response = await fetch(`http://localhost:3000/groups/${id}/expenses/${expenseId}/remove-contribution`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            });

            if (!response.ok) {
                await handleError(response);
                return;
            }
            fetchExpenses();
        } catch (error) {
            alert(`Error al quitar la contribución: ${error.message || error}`);
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

            fetchExpenses();
        } catch (error) {
            alert(`Error eliminando gasto: ${error.message || error}`);
        }
    };

    const toggleDropdown = (expenseId) => {
        setOpenDropdownId(prevId => (prevId === expenseId ? null : expenseId));
        if (openContributorDropdownId !== null) {
            setOpenContributorDropdownId(null);
        }
    };

    const closeDropdownManually = () => {
        setOpenDropdownId(null);
    };

    const toggleContributorDropdown = (expenseId) => {
        setOpenContributorDropdownId(prevId => (prevId === expenseId ? null : expenseId));
        if (openDropdownId !== null) {
            setOpenDropdownId(null);
        }
    };

    const closeContributorDropdownManually = () => {
        setOpenContributorDropdownId(null);
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

    useEffect(() => {
        const handleClickOutsideContributor = (event) => {
            if (contributorDropdownRef.current && !contributorDropdownRef.current.contains(event.target)) {
                setOpenContributorDropdownId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutsideContributor);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideContributor);
        };
    }, [contributorDropdownRef]);

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
                        Filtrado por tipos de gastos
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
                        {isCurrentUserAdmin && (
                            <span className="edit-delete-header">Editar/Eliminar</span>
                        )}
                    </div>

                    {filteredExpenses.length > 0 ? (
                        filteredExpenses.map(expense => (
                            <div key={expense.id} className={`expense-row ${expense.isCovered ? "covered-expense" : "pending-expense"}`}>
                                <div className="name-expense">
                                    <h5 className="color-expense">{expense.title}</h5>
                                    {expense.isCovered ? (
                                        <span className="expense-label covered-expense-label">Cubierto</span>
                                    ) : (
                                        <span className="expense-label pending-expense-label">Pendiente</span>
                                    )}
                                </div>

                                <div className="amount-expense">
                                    <h5 className="color-expense">{expense.amount ? expense.amount.toFixed(2) : '0.00'}€</h5>
                                </div>

                                <div className="contribute-expense">
                                    {expense.currentUserHasContributed ? (
                                        <button
                                            className="uncontribute-button-red"
                                            onClick={() => handleUncontribute(expense.id)}
                                        >
                                            Cubierto
                                        </button>
                                    ) : (
                                        expense.isCovered ? (
                                            null
                                        ) : (
                                            <button className="contribute-button-green" onClick={() => handleContribute(expense.id)}>
                                                Sin cubrir
                                            </button>
                                        )
                                    )}
                                </div>

                                <div className="contributed-by" ref={contributorDropdownRef}>
                                    {expense.contributors && expense.contributors.length > 0 ? (
                                        expense.contributors.length > 1 ? (
                                            <div className="dropdown-container">
                                                <div className="custom-dropdown styled-dropdown-header" onClick={() => toggleContributorDropdown(expense.id)}>
                                                    Pagado por ({expense.contributors.length})
                                                </div>
                                                {openContributorDropdownId === expense.id && (
                                                    <div className="dropdown-content">
                                                        {expense.contributors.map((contributor) => (
                                                            <div key={contributor.id} className="dropdown-item">
                                                                {contributor.name}: {contributor.amount ? contributor.amount.toFixed(2) : '0.00'}€
                                                            </div>
                                                        ))}
                                                        <button onClick={closeContributorDropdownManually} className="close-dropdown-button-bottom">
                                                            <FaTimes /> Cerrar
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            // Si solo hay un contribuidor, mostrarlo directamente
                                            expense.contributors.map(contributor => (
                                                <span key={contributor.id} className="contributor-name">
                                                    {contributor.name}: {contributor.amount ? contributor.amount.toFixed(2) : '0.00'}€
                                                </span>
                                            ))
                                        )
                                    ) : (
                                        <span>Nadie ha contribuido </span>
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

                                {/* Mostrar botones de Editar/Eliminar solo si el usuario actual es el administrador */}
                                {isCurrentUserAdmin && (
                                    <div className="edition-expense">
                                        <button onClick={() => handleEdit(expense.id)} className="edit-btn">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDeleteClick(expense.id)} className="delete-btn">
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="no-expenses">{selectedCategories.length > 0 ? 'No hay gastos con estas categorías.' : 'No hay gastos registrados.'}</p>
                    )}
                </div>
                <div className="expense-list-bottom">
                    {isCurrentUserAdmin && (
                        <button className="expense-list-button" onClick={() => navigate(`/AñadirGastos/${id}`)}>
                            <h2 className="color-expense">Añadir Gasto</h2>
                        </button>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}