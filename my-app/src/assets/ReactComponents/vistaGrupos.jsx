import React, { useState, useEffect } from "react";
import '../CSS/vistaGrupos.css';
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

export default function VistaGrupos() {
    // Estados para los grupos, cargando, error y la cantidad de grupos que se van a mostrar
    const [grupos, setGrupos] = useState([]);
    const [gruposParaMostrar, setGruposParaMostrar] = useState(4); // Mostrar 4 grupos inicialmente
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = "falso-token";  // Token falso para probar
        const url = 'http://localhost:3000/group/mine';  // URL de la API
        /**
         * const token = localStorage.getItem("token");
         * if (token) {
         *     fetch('http://localhost:3000/group/mine', {
         *         method: 'GET',
         *         headers: {
         *             'Authorization': `Bearer ${token}`,
         *             'Content-Type': 'application/json'
         *         }
         *     })
         * }
         * .then(response => response.json())
         * .then(data => {
         *     setGrupos(data);  // Establecer los grupos obtenidos en el estado
         *     setLoading(false);  // Cambiar el estado de carga
         * })
         * .catch(error => {
         *     setError(error.message);  // Manejo de errores en la solicitud
         *     setLoading(false);
         * });
         *
         * **/
        // Simular una respuesta de la API con un conjunto de datos de ejemplo
        if (token === "falso-token") {
            // Simulamos una respuesta de la API con un conjunto de grupos de ejemplo
            const gruposDeEjemplo = [
                { id: 1, nombre: "Grupo A" },
                { id: 2, nombre: "Grupo B" },
                { id: 3, nombre: "Grupo C" },
                { id: 4, nombre: "Grupo D" },
                { id: 5, nombre: "Grupo E" },
                { id: 6, nombre: "Grupo F" },
                { id: 7, nombre: "Grupo G" },
                { id: 8, nombre: "Grupo H" },
                { id: 9, nombre: "Grupo I" },
                { id: 10, nombre: "Grupo J" }
            ];

            // Simulamos la carga de los datos después de un pequeño retraso (usamos setTimeout)
            setTimeout(() => {
                setGrupos(gruposDeEjemplo);  // Almacenar los grupos en el estado
                setLoading(false);  // Cambiar el estado de carga
            }, 1000);  // Retraso de 1 segundo para simular la solicitud
        }
    }, []);

    // Función para cargar más grupos
    const cargarMasGrupos = () => {
        setGruposParaMostrar(gruposParaMostrar + 4);  // Incrementar el número de grupos a mostrar en 4
    };

    return (
        <div>
            <Header />
            <div className="vistaGrupos">
                <div className="top-text">
                    <h1>Your Groups:</h1>
                </div>

                <div className="groupTray">
                    {loading ? (
                        <p>Loading...</p>  // Mostrar mensaje de carga mientras se obtienen los datos
                    ) : error ? (
                        <p>Error: {error}</p>  // Mostrar mensaje de error si la solicitud falla
                    ) : grupos.length > 0 ? (
                        grupos.slice(0, gruposParaMostrar).map((grupo) => (
                            <div className="groupDisplay" key={grupo.id}>
                                <h1>{grupo.nombre}</h1>  {/* Nombre del grupo */}
                                <button className="btn-showMore">. . .</button>
                            </div>
                        ))
                    ) : (
                        <p>You don't have any groups.</p>  // Mostrar si no hay grupos
                    )}
                </div>

                <div className="bottom-text">
                    <button className="btn-addGroup" onClick={cargarMasGrupos}>
                        More Groups
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
}
