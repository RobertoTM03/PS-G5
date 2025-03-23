import React from "react";

export function Header() {
    return (
        <header style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "20px",
            height: "60px",
            backgroundColor: "#fff"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                {/* Ícono de campana (Notificación) */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M12 22c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zm6-6v-5c0-2.8-1.9-5.1-4.5-5.8V4c0-.8-.7-1.5-1.5-1.5S10 3.2 10 4v1.2C7.3 5.9 5.5 8.2 5.5 11v5l-1.7 1.7c-.3.3-.3.8 0 1.1s.8.3 1.1 0L6 17h12l1.1 1.1c.3.3.8.3 1.1 0s.3-.8 0-1.1L18 16z"/>
                </svg>

                {/* Ícono de usuario */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-4.42 0-8 3.58-8 8 0 .55.45 1 1 1h14c.55 0 1-.45 1-1 0-4.42-3.58-8-8-8z"/>
                </svg>

                {/* Espacio para el nombre de usuario */}
                <span style={{ fontSize: "16px", fontWeight: "bold", color: "#000" }}>Username</span>
            </div>
        </header>
    );
}







export default Header;
