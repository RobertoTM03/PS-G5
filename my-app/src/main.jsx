import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "./assets/Inicio";
import Registrarse from "./assets/Registrarse.jsx";
import IniciarSesion from "./assets/signIn.jsx";
import { PasswordRecover } from "./assets/passwordRecover.jsx";
import ResetearContraseña from "./assets/ResetearContraseña.jsx";
import GroupAdminView from "./assets/GroupAdminView.jsx";
import VistaGrupos from "./assets/vistaGrupos.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/Registrarse" element={<Registrarse />} />
        <Route path="/IniciarSesion" element={<IniciarSesion />} />
        <Route path="/PasswordRecover" element={<PasswordRecover />} />
        <Route path="/Resetear" element={<ResetearContraseña />} />
        <Route path="/vistaGrupos" element={<VistaGrupos />} />
        <Route path="/GroupAdminView" element={<GroupAdminView />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);