import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./Inicio.jsx";
import Registrarse from "./Registrarse.jsx";
import IniciarSesion from "./signIn.jsx";
import { PasswordRecover } from "./passwordRecover.jsx";
import ResetearContraseña from "./ResetearContraseña.jsx";
import GroupAdminView from "./GroupAdminView.jsx";
import VistaGrupos from "./vistaGrupos.jsx";
import AddMemberModal from "./AddMemberModal.jsx";
import AddGroupForm from "./AddGroupForm.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={< Inicio />} />
        <Route path="/Registrarse" element={<Registrarse />} />
        <Route path="/IniciarSesion" element={<IniciarSesion />} />
        <Route path="/PasswordRecover" element={<PasswordRecover />} />
        <Route path="/Resetear" element={<ResetearContraseña />} />
        <Route path="/vistaGrupos" element={<VistaGrupos />} />
        <Route path="/GroupAdminView/:id" element={<GroupAdminView />} />
        <Route path="/AddGroupForm" element={<AddGroupForm />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);