import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./components/home/Inicio.jsx";
import Registrarse from "./components/auth/Registrarse.jsx";
import IniciarSesion from "./components/auth/signIn.jsx";
import PasswordRecovery from "./components/auth/PasswordRecovery.jsx";
import PasswordReset from "./components/auth/PasswordReset.jsx";
import GroupAdminView from "./components/groups/GroupAdminView.jsx";
import AddMemberModal from "./components/groups/AddMemberModal.jsx";
import AddGroupForm from "./components/groups/AddGroupForm.jsx";
import { FirebaseProvider } from './Firebase.jsx';
import VistaGrupos from "./components/groups/viewgroups.jsx";

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