import React, { useState } from "react";
import './AddGroupForm.css';

const AddGroupForm = ({ onClose, onGroupCreated }) => {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:3000/groups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ titulo, descripcion })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Grupo creado con éxito.`);
                setTitulo("");
                setDescripcion("");
                if (onGroupCreated) onGroupCreated();
                if (onClose) onClose();
            } else {
                alert(`Error: ${data.msg}`);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error en la solicitud. Revisa la consola para más detalles.");
        }
    };

    return (
        <div className="group-container">
            <div className="group-header">
                <h2>Añadir Grupo</h2>
            </div>
            <div className="group-form">
                <div className="form-label">
                    <label>Título</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Título"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </div>
                <div className="form-label">
                    <label>Descripción</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    ></textarea>
                </div>
            </div>
            <div className="group-footer">
                <button className="submit-button-add-group" onClick={handleSubmit}>
                    Crear Grupo
                </button>
                <button className="cancel-button-add-group" onClick={onClose}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default AddGroupForm;
