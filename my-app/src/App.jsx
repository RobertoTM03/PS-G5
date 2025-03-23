import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./assets/Inicio.jsx";
import Registrarse from "./assets/Registrarse.jsx";
import IniciarSesion from "./assets/signIn.jsx";
import Resetear from "./assets/ResetearContraseña.jsx";
import GroupAdminView from "./assets/GroupAdminView.jsx";
import PasswordRecover from "./assets/passwordRecover.jsx";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/Registrarse" element={<Registrarse />} />
                <Route path="/IniciarSesion" element={<IniciarSesion />} />
                <Route path="/Resetear" element={<Resetear />} />
                <Route path="/PasswordRecover" element={<PasswordRecover />} />
            </Routes>
        </Router>
    );
}
