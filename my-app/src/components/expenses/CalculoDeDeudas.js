function obtenerSaldos(gastos, integrantes) {
    const saldos = {};
    integrantes.forEach(integrante => saldos[integrante] = 0);
    const tolerancia = 0.001;

    for (const gasto of gastos) {
        const totalPagoGasto = gasto.amount;
        const numIntegrantes = integrantes.length;
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

            for (const integrante of integrantes) {
                const pagoIntegrante = contribucionesPorUsuario[integrante] || 0;
                if (esPagoEquitativo && totalPagoGasto > 0) {
                    saldos[integrante] += pagoIntegrante - (totalPagoGasto / numIntegrantes);
                } else if (totalPagoGasto > 0) {
                    saldos[integrante] += pagoIntegrante - (totalPagoGasto / numIntegrantes); // También lo comparamos con la parte equitativa para ver el saldo final
                }
            }
        } else if (totalPagoGasto > 0) {
            // Si no hay contribuciones, tratamos como si cada uno debiera la parte equitativa
            for (const integrante of integrantes) {
                saldos[integrante] -= (totalPagoGasto / numIntegrantes);
            }
        }
    }

    return Object.keys(saldos).map(name => ({ name: name, amount: saldos[name] }));
}

// Ejemplo de uso:
const integrantesEjemploSaldos = ["Maria", "Pablo", "Ana"];
const gastosEjemploSaldos = [
    {
        amount: 100,
        contributions: [
            { user: { id: 1, name: "Maria" }, amount: 33.33 },
            { user: { id: 2, name: "Pablo" }, amount: 33.33 },
            { user: { id: 3, name: "Ana" }, amount: 33.34 },
        ],
    },
    {
        amount: 50,
        contributions: [
            { user: { id: 1, name: "Maria" }, amount: 40 },
            { user: { id: 2, name: "Pablo" }, amount: 10 },
        ],
    },
    {
        amount: 80,
        contributions: [],
    },
];

const saldosFinales = obtenerSaldos(gastosEjemploSaldos, integrantesEjemploSaldos);
console.log(JSON.stringify(saldosFinales, null, 2));