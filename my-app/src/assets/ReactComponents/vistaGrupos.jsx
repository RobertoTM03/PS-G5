import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importamos el hook useNavigate
import '../CSS/vistaGrupos.css';
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

export default function VistaGrupos() {
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // ✅ Correcto: Declarar useNavigate() aquí, fuera de useEffect

    useEffect(() => {
        const token = localStorage.getItem("token");
        const url = 'http://localhost:3000/groups/mine';

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

    // ✅ Función para navegar a la página de administración del grupo
    const handleGroupClick = (groupId) => {
       //let groupidds= localStorage.setItem('${groupId}');
        navigate(`/GroupAdminView/`); // Navega a /group-admin/{id}

    };
    const handleGroupClick2 = () => {
        //let groupidds= localStorage.setItem('${groupId}');
        navigate(`/AddGroupForm`); // Navega a /group-admin/{id}

    };
    const handleDeleteGroup = (groupId) => {
        const token = localStorage.getItem("token");
        const url = `http://localhost:3000/groups/${groupId}`;  // Endpoint DELETE para eliminar el grupo

        if (window.confirm("¿Estás seguro de que deseas eliminar este grupo?")) {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(() => {
                    // Después de eliminar, actualiza la lista de grupos
                    setGrupos((prevGrupos) => prevGrupos.filter((grupo) => grupo.groupId !== groupId));
                })
                .catch((error) => {
                    console.error('Error al eliminar el grupo:', error);
                    alert("Hubo un error al eliminar el grupo.");
                });
        }
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
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : grupos.length > 0 ? (
                        grupos.map((grupo) => (
                            <div className="groupDisplay" key={grupo.groupId}>
                                <h1 onClick={() => handleGroupClick(grupo.groupId)}>{grupo.titulo}</h1>
                                {/* ✅ El botón ahora usa navigate() */}
                                <button onClick={() => handleDeleteGroup(grupo.groupId)} className="btn-showMore">. . .</button>
                            </div>
                        ))
                    ) : (
                        <p>No groups found.</p>
                    )}
                </div>

                <div className="bottom-text">
                    <button  onClick={handleGroupClick2} className="btn-addGroup">Create Group</button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
