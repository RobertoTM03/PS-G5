import React, { useEffect, useState } from "react";
import "./Inicio.css";

import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";

import mundo from "../../../assets/pictures/mundo.png";
import money from "../../../assets/pictures/money.png";
import calendar from "../../../assets/pictures/calendar.png";
import mapa from "../../../assets/pictures/mapa.png";
import documentos from "../../../assets/pictures/docs.png";
import chat from "../../../assets/pictures/chatea.png";

export default function Inicio() {

    const [authenticated, setAuthenticated] = useState(false);

    const handleSignupClick = () => {
        window.location.href = "./Registrarse";
    };
    const handleSignInClick = () => {
        window.location.href = "./IniciarSesion";
    };

    const handleAccessClick = () => {
        window.location.href = "./vistaGrupos";
    }

    useEffect(() => {
        const sessionToken = localStorage.getItem("token");
        if (sessionToken) setAuthenticated(true);
    });

    return (
        
        <div className="inicio">
            <Header/>


            <div className="container">
                <div className="left-section">
                    <h1>¡Viajar en grupo puede ser fácil!</h1>
                    <p>
                        Facilita la colaboración en equipo con herramientas para organizar
                        grupos, dividir gastos, gestionar eventos y mucho más. 
                    </p>  
                    <p>  
                        ¡Inicia sesión y empieza a organizar tu viaje en grupo!
                    </p>
                    {
                        authenticated ? 
                        (
                            <div id="call-to-action">
                                <button className="btn home-btn" onClick={handleAccessClick}>
                                    Acceder
                                </button>
                            </div>
                            
                        ) : (
                            <div id="call-to-action">
                                <button className="btn login-btn" onClick={handleSignInClick}>
                                    Acceder
                                </button>
                                <button className="btn signup-btn" onClick={handleSignupClick}>
                                    Registrarse
                                </button>
                            </div>
                        )
                    }
                    
                </div>

                <div className="right-section">
                    <div className="image-placeholder">
                        <img src={mundo} alt="mundo" className="mundo-image" />
                    </div>
                </div>
            </div>

            <div className="highlight-section">
                <h1 className="highlight-title">¿Cómo funciona TripCollab?</h1>
            </div>
            
            <div className="container2">
                <div className="left-section2">
                    <div className="image-placeholder">
                        <img src={money} alt="money" className="feature-image2" />
                    </div>
                </div>
                <div className="right-section2"> 
                    <h1>Administra tus gastos</h1>
                    <p>
                        Con nuestra aplicación ya no tendrás que usar una calculadora. Simplemente añadiendo los gastos, ¡te decimos el total!
                    </p>
                </div>
            </div>

            <div className="container">
                <div className="left-section">
                    <h1>Añade eventos al calendario grupal</h1>
                    <p>
                        Con nuestro calendario personalizado puedes añadir actividades, fechas importantes y mantener a todos sincronizados en un solo lugar.
                    </p>
                </div>
                <div className="right-section"> 
                    <div className="image-placeholder">
                        <img src={calendar} alt="calendar" className="feature-image2" />
                    </div>
                </div>
            </div>

            <div className="container2">
                <div className="left-section2">
                    <div className="image-placeholder">
                        <img src={mapa} alt="mapa" className="feature-image2" />
                    </div>
                </div>
                <div className="right-section2"> 
                    <h1>Marca puntos en el mapa </h1>
                    <p>
                    Comparte ubicaciones clave con tu grupo como alojamientos, restaurantes o lugares turísticos. Todos los miembros podrán verlos fácilmente y mantenerse coordinados durante el viaje.
                    </p>
                </div>
            </div>

            <div className="container">
                <div className="left-section">
                    <h1>Sube tus documentos</h1>
                    <p>
                        Comparte archivos importantes con tu grupo, como boletos o reservas. Todo en un solo lugar, accesible para todos los miembros en cualquier momento.
                    </p>
                </div>
                <div className="right-section"> 
                    <div className="image-placeholder">
                        <img src={documentos} alt="calendar" className="feature-image2" />
                    </div>
                </div>
            </div>

            <div className="container2">
                <div className="left-section2">
                    <div className="image-placeholder">
                        <img src={chat} alt="chat" className="feature-image"/>
                    </div>
                </div>
                <div className="right-section2"> 
                    <h1>Chatea con tu grupo</h1>
                    <p>
                    Comunícate en tiempo real con todos los miembros de tu grupo. Coordina planes, resuelve dudas y mantén la conversación fluida sin salir de la app.
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}
