import React, { useEffect, useState } from "react";
import './DividedExpense.css';
import { useNavigate, useParams } from "react-router-dom";

const DividedExpense = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem('token');

    const [groupData, setGroupData] = useState({ members: [], isOwner: false });
    const [selectedUserIds, setSelectedUserIds] = useState('');


    const fetchGroupData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/groups/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const data = await response.json();

            setGroupData({
                members: (data.integrantes || []).map(user => ({
                    id: user.userId,
                    name: user.nombre,
                })),
                isOwner: data.isOwner || false,
            });
        } catch (error) {
            console.error('Error fetching group data:', error);
        }
    };

    useEffect(() => {
        fetchGroupData();
    }, []);

    return (
        <div className="divided-expense-container">
            <div className="divided-expense-header">
                <h2>Gasto Dividido</h2>
            </div>

            <div className="divided-expense-form">
                <div className="divided-expense-form-label">
                    <label>Contribuidor</label>
                    <div className="divided-expense-dropdown-container">
                        <select
                            className="form-input"
                            value={selectedUserIds}
                            onChange={(e) => setSelectedUserIds(e.target.value)}
                        >
                            <option value="">Seleccione un usuario</option>
                            {groupData.members.map(member => (
                                <option key={member.id} value={member.id}>
                                    {member.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="divided-expense-form-label">
                    <label>Importe</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-input"
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className="divided-expense-group-footer">
                <button className="submit-button-add-group">Añadir</button>
                <button className="cancel-button-add-group" onClick={() => navigate(`/Gastos/${id}`)}>Cancelar</button>
            </div>
        </div>
    );
};

export default DividedExpense;
