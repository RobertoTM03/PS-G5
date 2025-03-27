import React, { useState, useEffect } from "react";
import '../CSS/vistaGrupos.css';
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

export default function VistaGrupos() {
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const url = 'http://localhost:3000/groups/mine';

        if (!token) {
            console.error("⚠️ No token found! Redirecting to login...");
            window.location.href = "/login";
            return;
        }

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.status === 401) {
                    throw new Error('Error 401: No autorizado. Redirigiendo a login...');
                }
                if (response.status === 404) {
                    throw new Error('Error 404: No se encontraron grupos.');
                }
                if (response.status === 500) {
                    throw new Error('Error 500: Problema con el servidor.');
                }
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                setGrupos(data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error.message);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <Header />
            <div className="vistaGrupos">
                <div className="top-text">
                    <h1>Your Groups:</h1>
                </div>

                <div className="groupTray">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : grupos.length > 0 ? (
                        grupos.map((grupo) => (
                            <div className="groupDisplay" key={grupo.groupId}>
                                <h1>{grupo.titulo}</h1>
                                <p>{grupo.descripcion}</p>
                                <button className="btn-showMore">. . .</button>
                            </div>
                        ))
                    ) : (
                        <p>No groups found.</p>
                    )}
                </div>

                <div className="bottom-text">
                    <button className="btn-addGroup">Create Group</button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
