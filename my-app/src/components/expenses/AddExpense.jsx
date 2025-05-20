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
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const expenseToEdit = location.state?.expense;

    const [groupData, setGroupData] = useState({ members: [], isOwner: false });
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [splitType, setSplitType] = useState('equal'); // 'equal' or 'unequal'
    // Eliminamos individualAmounts si no vamos a usar splitType 'unequal' de momento.
    // const [individualAmounts, setIndividualAmounts] = useState({}); // Para manejar montos desiguales

    const token = localStorage.getItem('token');

    const toggleType = (type) => {
        setSelectedTypes((prevTypes) =>
            prevTypes.includes(type)
                ? prevTypes.filter((t) => t !== type)
                : [...prevTypes, type]
        );
    };

    const toggleUser = (userId) => {
        setSelectedUserIds((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId) // lo quita si ya está
                : [...prevSelected, userId] // lo agrega si no está
        );
    };

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);


    async function handleError(errorResponse) {
        const errorBody = await errorResponse.json();
        const error = errorBody.error;
        alert(error);
        if (errorResponse.status === 403) navigate("/InicioSesion");
    }

    const fetchGroupData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/groups/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const data = await response.json();

            setGroupData({
                members: (data.integrantes || []).map(user => ({
                    id: user.userId, // Aseguramos que el id del miembro sea el userId
                    name: user.nombre,
                })),
                isOwner: data.isOwner || false,
            });
        } catch (error) {
            console.error('Error fetching group data:', error);
        }
    };

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
        fetchGroupData();

        if (expenseToEdit) {
            setTitle(expenseToEdit.title);
            setAmount(expenseToEdit.amount);
            setSelectedTypes(expenseToEdit.tags || []);
            setSelectedUserIds(expenseToEdit.contributors?.map(c => c.userId) || []);
            setSplitType(expenseToEdit.splitType || 'equal');
            // Si estuviéramos editando y tuviéramos montos desiguales, necesitaríamos inicializar individualAmounts aquí.
            // Para el propósito de esta corrección, lo dejamos simplificado para "equal".
        }
    }, [expenseToEdit, token, navigate, id]);

    // Si no vamos a usar splitType 'unequal' de momento, podemos eliminar esta función
    // const handleAmountChange = (userId, value) => {
    //     setIndividualAmounts({
    //         ...individualAmounts,
    //         [userId]: parseFloat(value),
    //     });
    // };

    const handleSubmit = async () => {
        // Validar el título
        if (!title.trim()) { // .trim() para asegurar que no solo sean espacios en blanco
            alert(`Faltan campos requeridos: title`);
            return;
        }

        // Validar el importe y parsearlo
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) { // El importe debe ser un número positivo
            alert('Por favor, introduce un importe válido y mayor que cero.');
            return;
        }

        // Validar que se haya seleccionado al menos un contribuidor
        if (selectedUserIds.length === 0) {
            alert('Debes seleccionar al menos un contribuidor.');
            return;
        }

        let contributorsData;

        // Si es división igualitaria
        if (splitType === 'equal') {
            const equalAmount = parsedAmount / selectedUserIds.length;
            contributorsData = selectedUserIds.map(userId => ({ id: userId, amount: equalAmount })); // Corrección: 'id' en lugar de 'userId'
        } else {
            // Este bloque solo se ejecutaría si tuvieras la lógica para 'unequal' habilitada
            // y los inputs para montos individuales.
            // Por ahora, se asume que si llegamos aquí y no es 'equal', hay un error lógico
            // o falta la implementación completa de 'unequal'.
            alert('El tipo de reparto "Desigual" aún no está completamente implementado o configurado para esta funcionalidad.');
            return; // Detenemos la ejecución si el tipo es 'unequal' y no hay lógica para ello.
        }

        const newExpense = {
            title: title,
            amount: parsedAmount,
            tags: selectedTypes,
            contributors: contributorsData, // Ya contiene los userId y amounts correctos
            splitType: splitType,
        };

        try {
            let response;
            if (expenseToEdit) {
                // Asumiendo que la edición usa un método PATCH o PUT, no POST
                response = await fetch(`http://localhost:3000/groups/${id}/expenses/${expenseToEdit.id}`, {
                    method: 'PATCH', // O 'PUT' dependiendo de tu API
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
                {/* Eliminado el select de Tipo de Reparto si no se va a usar la lógica de "unequal" de momento */}
                {/* <div className="form-label">
                    <label>Tipo de Reparto</label>
                    <select
                        className="form-input"
                        value={splitType}
                        onChange={(e) => setSplitType(e.target.value)}
                    >
                        <option value="equal">Igual</option>
                        <option value="unequal">Desigual</option>
                    </select>
                </div> */}
                <div className="form-label">
                    <label>Contribuidores</label>
                    <div className="dropdown-container">
                        <button
                            className="dropdown-button"
                            onClick={toggleUserDropdown}
                        >
                            Seleccionar contribuyentes
                        </button>

                        {userDropdownOpen && (
                            <div className="dropdown-menu">
                                {groupData.members.map((member) => (
                                    <div key={member.id} className="dropdown-item">
                                        <label>
                                            {member.name}
                                            <input
                                                type="checkbox"
                                                checked={selectedUserIds.includes(member.id)}
                                                onChange={() => toggleUser(member.id)}
                                            />
                                        </label>
                                        {/* Este input solo se mostraría si splitType es 'unequal' y tienes la lógica para ello */}
                                        {/* {splitType === 'unequal' && (
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={individualAmounts[member.id] || 0}
                                                onChange={(e) => handleAmountChange(member.id, e.target.value)}
                                                placeholder="Monto"
                                            />
                                        )} */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-label">
                    <label>Tipo de gasto</label>
                    <div className="dropdown-container">
                        <button
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

