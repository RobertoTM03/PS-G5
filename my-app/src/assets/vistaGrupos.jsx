import React from "react";
import './vistaGrupos.css';

export default function VistaGrupos() {
    return (
    <div className="vistaGrupos">
        <div className="top-text">
            <h1>Your Groups:</h1>
        </div>
        <div className="groupTray">
            <div className="groupDisplay">
                <h1>Group1</h1>
                <button className="btn-showMore" >. . .</button>
            </div>
        </div>
        <div className="bottom-text">
            <button className="btn-addGroup" >Create Group</button>
        </div>
    </div>
    );
}

