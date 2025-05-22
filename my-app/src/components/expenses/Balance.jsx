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
    const [userInfo, setUserInfo] = useState(null); // Nuevo estado para la información del usuario

    useEffect(() => {
        const obtenerSaldosConApi = (groupId, token) => {
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
                    const integrantesEnGastos = new Set();

                    gastosData.forEach(gasto => {
                        if (gasto.contributors) {
                            gasto.contributors.forEach(contribucion => {
                                integrantesEnGastos.add(contribucion.name);
                            });
                        }
                    });

                    integrantesEnGastos.forEach(integrante => saldosCalculados[integrante] = 0);
                    const integrantesNombres = Array.from(integrantesEnGastos);
                    const numTotalIntegrantes = integrantesNombres.length;

                    for (const gasto of gastosData) {
                        const totalPagoGasto = gasto.amount;
                        const contribucionesPorUsuario = {};

                        if (gasto.contributors && gasto.contributors.length > 0) {
                            gasto.contributors.forEach(contribucion => {
                                const userName = contribucion.name;
                                const amount = contribucion.amount;
                                contribucionesPorUsuario[userName] = (contribucionesPorUsuario[userName] || 0) + amount;
                            });

                            for (const integrante of integrantesNombres) {
                                const pagoIntegrante = contribucionesPorUsuario[integrante] || 0;
                                saldosCalculados[integrante] += pagoIntegrante - (totalPagoGasto / numTotalIntegrantes);
                            }
                        } else if (totalPagoGasto > 0 && numTotalIntegrantes > 0) {
                            for (const integrante of integrantesNombres) {
                                saldosCalculados[integrante] -= (totalPagoGasto / numTotalIntegrantes);
                            }
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
                } else {
                    // Manejar el error (por ejemplo, redirigir a la página de inicio de sesión)
                    console.error("Error al obtener la información del usuario");
                    setError("No se pudo obtener la información del usuario.");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error de red al obtener la información del usuario:", error);
                setError("Error de red al obtener la información del usuario.");
                setLoading(false);
            }
        };


        setLoading(true);
        Promise.all([obtenerSaldosConApi(groupId, token), fetchUserInfo()])
            .then(([saldosData]) => {
                setSaldos(saldosData);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [groupId, token]);

    useEffect(() => {
        const calcularDeudaTotal = () => {
            if (!userInfo) return;

            const saldoUsuario = saldos.find(saldo => saldo.name === userInfo.name);
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
        return <div>Cargando saldos...</div>;
    }

    if (error) {
        return <div>Error al cargar los saldos: {error}</div>;
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
                            <p>No hay saldos disponibles.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

