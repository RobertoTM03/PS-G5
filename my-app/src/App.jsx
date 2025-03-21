import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./assets/Inicio.jsx";
import Registrarse from "./assets/Registrarse.jsx";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/Registrarse" element={<Registrarse />} /> {/* Aquí corregimos la ruta */}
            </Routes>
        </Router>
    );
}
