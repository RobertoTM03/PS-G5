import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";
import './Balance.css';

export default function Balance() {
    const navigate = useNavigate();
    const { id: groupId } = useParams();
    const token = localStorage.getItem('token');
    const [saldos, setSaldos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deudaTotalGrupo, setDeudaTotalGrupo] = useState('0.00€');
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/groups/${groupId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error(`Error al obtener los detalles del grupo: ${response.status}`);
                }
                const data = await response.json();
                return (data.integrantes || []).map(member => ({
                    id: member.userId,
                    name: member.nombre
                }));
            } catch (error) {
                console.error("Error fetching group details:", error);
                throw error;
            }
        };

        const obtenerSaldosConApi = (groupId, token, allGroupMembers) => {
            return fetch(`http://localhost:3000/groups/${groupId}/expenses/`, {
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error al obtener los gastos: ${response.status}`);
                    }
                    return response.json();
                })
                .then(gastosData => {
                    const saldosCalculados = {};

                    allGroupMembers.forEach(member => {
                        saldosCalculados[member.name] = 0;
                    });

                    const numTotalIntegrantes = allGroupMembers.length;
                    if (numTotalIntegrantes === 0) {
                        return allGroupMembers.map(member => ({ name: member.name, amount: 0 }));
                    }

                    for (const gasto of gastosData) {
                        const totalGasto = gasto.amount;

                        const contribucionesActuales = {};
                        if (gasto.contributors && gasto.contributors.length > 0) {
                            gasto.contributors.forEach(contribucion => {
                                const contributorMember = allGroupMembers.find(m => String(m.id) === String(contribucion.id));
                                const contributorName = contributorMember ? contributorMember.name : contribucion.name;

                                if (contributorName) {
                                    contribucionesActuales[contributorName] = (contribucionesActuales[contributorName] || 0) + contribucion.amount;
                                }
                            });
                        }

                        const sharePerPerson = totalGasto / numTotalIntegrantes;

                        for (const member of allGroupMembers) {
                            const contributedByMember = contribucionesActuales[member.name] || 0;
                            saldosCalculados[member.name] += (contributedByMember - sharePerPerson);
                        }
                    }
                    return Object.keys(saldosCalculados).map(name => ({ name: name, amount: saldosCalculados[name] }));
                });
        };

        const fetchUserInfo = async () => {
            try {
                const response = await fetch('http://localhost:3000/auth/my-information', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);
                    return data;
                } else {
                    setError("No se pudo obtener la información del usuario.");
                    return null;
                }
            } catch (error) {
                console.error("DEBUG: Error de red al obtener la información del usuario:", error);
                setError("Error de red al obtener la información del usuario.");
                return null;
            }
        };

        setLoading(true);
        Promise.all([fetchGroupDetails(), fetchUserInfo()])
            .then(([allGroupMembers, userInfoData]) => {
                if (userInfoData) {
                    return obtenerSaldosConApi(groupId, token, allGroupMembers);
                } else {
                    throw new Error("No se pudo obtener la información del usuario para calcular saldos.");
                }
            })
            .then(saldosData => {
                setSaldos(saldosData);
                setLoading(false);
            })
            .catch(err => {
                console.error("DEBUG: Error en Promise.all o en obtenerSaldosConApi:", err);
                setError(err.message || "Un error desconocido ocurrió.");
                setLoading(false);
            });
    }, [groupId, token]);

    useEffect(() => {


        const calcularDeudaTotal = () => {
            if (!userInfo || saldos.length === 0) {
                setDeudaTotalGrupo("0.00€");
                return;
            }

            const saldoUsuario = saldos.find(saldo => {
                const saldoNameCleanLower = saldo.name.trim().toLowerCase();
                const userInfoNameCleanLower = userInfo.name.trim().toLowerCase();
                const match = saldoNameCleanLower === userInfoNameCleanLower;
                return match;
            });



            if (saldoUsuario) {
                if (saldoUsuario.amount < 0) {
                    setDeudaTotalGrupo(`${Math.abs(saldoUsuario.amount).toFixed(2)}€`);
                } else {
                    setDeudaTotalGrupo("0.00€");

                }
            } else {
                setDeudaTotalGrupo("0.00€");

            }

        };

        calcularDeudaTotal();
    }, [saldos, userInfo]);

    if (loading) {
        return <div className="loading-message">Cargando saldos...</div>;
    }

    if (error) {
        return <div className="error-message">Error al cargar los saldos: {error}</div>;
    }

    return (
        <div>
            <Header />
            <div className="balance-header-bar">
                <div className="arrow-balance" onClick={() => navigate(`/GroupAdminView/${groupId}`)}>←</div>
                <h3 className="balance-title-text">Balance</h3>
            </div>
            <div className="main-container-balance">
                <div className="balance-navigation">
                    <button className="balance-nav-button" onClick={() => navigate(`/Gastos/${groupId}`)}>Gastos</button>
                    <button className="balance-nav-button active">Balance</button>
                </div>
                <div className="balance-details">
                    <h2>Balance del Grupo</h2>
                    <h3>Saldo que debo: {deudaTotalGrupo}</h3>
                    <div className="balance-table">
                        <div className="balance-header">
                            <span className="balance-header-item">Nombre</span>
                            <span className="balance-header-item">Saldo</span>
                        </div>
                        {saldos.length > 0 ? (
                            saldos.map((item, index) => (
                                <div key={index} className="balance-row">
                                    <span className="balance-item name-item"><h5 className="color-expense">{item.name}</h5></span>
                                    <span className={`balance-item amount-item ${item.amount < 0 ? 'negative-amount' : 'positive-amount'}`}>
                                        <h5>{item.amount > 0 ? '+' : ''}{item.amount.toFixed(2)}€</h5>
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="no-saldos-message">No hay saldos disponibles. Asegúrate de que el grupo tenga miembros y gastos.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}