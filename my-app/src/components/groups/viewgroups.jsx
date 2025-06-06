import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './viewgroupscss.css';

import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";

import AddGroupForm from "./AddGroupForm.jsx";

export default function VistaGrupos() {
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorType, setErrorType] = useState(null);
    const [noGroupsFound, setNoGroupsFound] = useState(false);
    const [showAddGroupForm, setShowAddGroupForm] = useState(false);
    const navigate = useNavigate();

    const fetchGroups = () => {
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
                    setErrorType('401');
                    throw new Error('Error 401: No autorizado. Redirigiendo a login...');
                }
                if (response.status === 404) {
                    setNoGroupsFound(true);
                    setLoading(false);
                    return;
                }
                if (response.status === 500) {
                    setErrorType('500');
                    throw new Error('Error 500: Problema con el servidor.');
                }
                if (!response.ok) {
                    setErrorType(response.status);
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
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleGroupClick = (groupId) => {
        navigate(`/GroupAdminView/${groupId}`);
    };

    const handleDeleteGroup = (groupId) => {
        const token = localStorage.getItem("token");
        const url = `http://localhost:3000/groups/${groupId}`;

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
                    if (response.status === 200) {
                        alert("Grupo eliminado exitosamente");
                        return response.json();
                    }
                    if (response.status === 401) {
                        throw new Error("Fallo de autenticación con el token del usuario");
                    }
                    if (response.status === 403) {
                        throw new Error("El usuario no tiene permiso para realizar la operación");
                    }
                    if (response.status === 404) {
                        throw new Error("Grupo no encontrado");
                    }
                    if (response.status === 500) {
                        throw new Error("Error no definido");
                    }
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                })
                .then(() => {
                    setGrupos((prevGrupos) => prevGrupos.filter((grupo) => grupo.groupId !== groupId));
                })
                .catch((error) => {
                    console.error('Error al eliminar el grupo:', error);
                    alert(error.message);
                });
        }
    };

    return (
        <div>
            <Header />
            <div className="vistaGrupos">
                <div className="top-text">
                    <h1 className={"Title-group"}>Tus Grupos:</h1>
                </div>
                <div className={"groupTray"}>
                    <div className={"ScrollMaster"}>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <div className={`error-message ${errorType === '401' || errorType === '500' ? 'error' : ''}`}>
                                {error}
                            </div>
                        ) : noGroupsFound ? (
                            <div className="error-message no-groups-found">No se encontraron grupos.</div>
                        ) : grupos.length > 0 ? (
                            grupos.map((grupo) => (
                                <div className="groupDisplay" key={grupo.groupId}>
                                    <h2 className={"Title-group"}
                                        onClick={() => handleGroupClick(grupo.groupId)}>{grupo.titulo}</h2>
                                    <button onClick={() => handleDeleteGroup(grupo.groupId)} className="trash-button" title="Eliminar grupo">
                                        🗑️
                                    </button>
                                    
                                </div>
                            ))
                        ) : (
                            <p>No hay grupos</p>
                        )}
                    </div>
                </div>
                <div className="bottom-text-view-groups">
                    <button onClick={() => setShowAddGroupForm(true)} className="btn-addGroup">
                        Crear Grupo
                    </button>
                </div>
                {showAddGroupForm && (
                    <div className="modal-group-form">
                        <AddGroupForm
                            onClose={() => setShowAddGroupForm(false)}
                            onGroupCreated={() => fetchGroups()}
                        />
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
