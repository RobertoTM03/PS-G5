import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Inicio from './assets/Inicio';
import Registrarse from './assets/Registrarse.jsx';
import IniciarSesion from './assets/signIn.jsx';
import { PasswordRecover } from './assets/passwordRecover.jsx';
import ResetearContraseña from "./assets/ResetearContraseña.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/Registrarse" element={<Registrarse />} />
                <Route path="/IniciarSesion" element={<IniciarSesion />} />
                <Route path="/PasswordRecover" element={<PasswordRecover />} />
                <Route path="/Resetear" element={<ResetearContraseña />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
