import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./Inicio.jsx";
import Registrarse from "./Registrarse.jsx";
import IniciarSesion from "./signIn.jsx";
import PasswordRecovery from "./PasswordRecovery.jsx";
import PasswordReset from "./PasswordReset.jsx";
import GroupAdminView from "./GroupAdminView.jsx";
import VistaGrupos from "./vistaGrupos.jsx";
import AddMemberModal from "./AddMemberModal.jsx";
import AddGroupForm from "./AddGroupForm.jsx";

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