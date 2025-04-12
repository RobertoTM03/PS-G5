import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./Inicio.jsx";
import Registrarse from "./auth/Registrarse.jsx";
import IniciarSesion from "./auth/signIn.jsx";
import PasswordRecovery from "./auth/PasswordRecovery.jsx";
import PasswordReset from "./auth/PasswordReset.jsx";
import GroupAdminView from "./groups/GroupAdminView.jsx";
import VistaGrupos from "./groups/vistaGrupos.jsx";
import AddMemberModal from "./groups/AddMemberModal.jsx";
import AddGroupForm from "./groups/AddGroupForm.jsx";

import { FirebaseProvider } from './Firebase.jsx';

function App() {
  return (
    <FirebaseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={< Inicio/>} />
          <Route path="/Registrarse" element={<Registrarse />} />
          <Route path="/IniciarSesion" element={<IniciarSesion />} />
          <Route path="/PasswordRecovery" element={<PasswordRecovery />} />
          <Route path="/PasswordReset" element={<PasswordReset />} />
          <Route path="/vistaGrupos" element={<VistaGrupos />} />
          <Route path="/GroupAdminView/:id" element={<GroupAdminView />} />
          <Route path="/AddGroupForm" element={<AddGroupForm />} />
        </Routes>
      </BrowserRouter>
    </FirebaseProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);