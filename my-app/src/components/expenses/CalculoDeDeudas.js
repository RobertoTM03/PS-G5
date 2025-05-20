function obtenerSaldosConApi(groupId, token) {
    return Promise.all([
        fetch(`http://localhost:3000/groups/${groupId}/expenses/`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include'
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener los gastos: ${response.status}`);
            }
            return response.json();
        }),
        fetch(`http://localhost:3000/groups/${groupId}/users/`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include'
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener los integrantes: ${response.status}`);
            }
            return response.json();
        })
    ])
        .then(([gastosData, integrantesData]) => {
            const saldos = {};
            const integrantesNombres = integrantesData.map(user => user.name);
            integrantesNombres.forEach(integrante => saldos[integrante] = 0);
            const tolerancia = 0.001;

            for (const gasto of gastosData) {
                const totalPagoGasto = gasto.amount;
                const numIntegrantes = integrantesNombres.length;
                let esPagoEquitativo = true;
                const porcentajes = {};
                let primerPorcentaje = -1;
                const contribucionesPorUsuario = {};

                if (gasto.contributions && gasto.contributions.length > 0) {
                    gasto.contributions.forEach(contribucion => {
                        const userName = contribucion.user.name;
                        const amount = contribucion.amount;
                        contribucionesPorUsuario[userName] = (contribucionesPorUsuario[userName] || 0) + amount;
                    });

                    if (totalPagoGasto > 0 && numIntegrantes > 0) {
                        let contribuyentes = Object.keys(contribucionesPorUsuario).length;
                        if (contribuyentes > 0) {
                            for (const user in contribucionesPorUsuario) {
                                const porcentaje = contribucionesPorUsuario[user] / totalPagoGasto;
                                porcentajes[user] = porcentaje;
                                if (primerPorcentaje === -1) {
                                    primerPorcentaje = porcentaje;
                                } else if (Math.abs(porcentaje - primerPorcentaje) > tolerancia) {
                                    esPagoEquitativo = false;
                                }
                            }
                            // Si no todos los integrantes contribuyeron y hubo más de un contribuyente, no es equitativo
                            if (contribuyentes < numIntegrantes && contribuyentes > 0) {
                                esPagoEquitativo = false;
                            } else if (contribuyentes === 1 && numIntegrantes > 1) {
                                esPagoEquitativo = false; // Un solo contribuyente en un grupo no es equitativo
                            }
                        } else if (totalPagoGasto > 0) {
                            esPagoEquitativo = false; // Hubo gasto pero nadie contribuyó
                        }
                    } else if (totalPagoGasto === 0) {
                        esPagoEquitativo = true;
                    } else {
                        esPagoEquitativo = false;
                    }

                    for (const integrante of integrantesNombres) {
                        const pagoIntegrante = contribucionesPorUsuario[integrante] || 0;
                        if (esPagoEquitativo && totalPagoGasto > 0) {
                            saldos[integrante] += pagoIntegrante - (totalPagoGasto / numIntegrantes);
                        } else if (totalPagoGasto > 0) {
                            saldos[integrante] += pagoIntegrante - (totalPagoGasto / numIntegrantes); // También lo comparamos con la parte equitativa para ver el saldo final
                        }
                    }
                } else if (totalPagoGasto > 0) {
                    // Si no hay contribuciones, tratamos como si cada uno debiera la parte equitativa
                    for (const integrante of integrantesNombres) {
                        saldos[integrante] -= (totalPagoGasto / numIntegrantes);
                    }
                }
            }

            return Object.keys(saldos).map(name => ({ name: name, amount: saldos[name] }));
        });
}

// En tu componente BalanceView o donde necesites calcular los saldos:
// import { useParams } from 'react-router-dom';
// const { id: groupId } = useParams();
// const token = localStorage.getItem('token');
//
// useEffect(() => {
//   obtenerSaldosConApi(groupId, token)
//     .then(saldos => {
//       console.log("Saldos finales:", JSON.stringify(saldos, null, 2));
//       // Aquí puedes actualizar el estado con los saldos para mostrarlos en la UI
//     })
//     .catch(error => {
//       console.error("Error al obtener los saldos:", error);
//     });
// }, [groupId, token]);

// Para probar la función aquí, necesitarías tener un `groupId` y un `token` válidos.
// Como no los tenemos directamente, te muestro cómo se llamaría dentro de tu componente React.