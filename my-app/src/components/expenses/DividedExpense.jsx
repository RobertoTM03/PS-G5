import React from "react";
import './DividedExpense.css';


const DividedExpense = () => {

    return (
        <div className="divided-expense-container">
            <div className="divided-expense-header">
                <h2>Gasto Dividido</h2>
            </div>

            <div className="divided-expense-form">
                <div className="divided-expense-form-label">
                    <label>Usuario</label>
                    <div className="divided-expense-dropdown-container">
                        <input
                            type="string"
                            className="form-input"
                            placeholder="Usuario"
                        />
                    </div>

                </div>
                <div className="divided-expense-form-label">
                    <label>Importe</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-input"
                        placeholder="0.00"
                    />
                </div>

            </div>
            <div className="divided-expense-group-footer">
                <button className="submit-button-add-group" >Añadir</button>
                <button className="cancel-button-add-group">Cancelar</button>
            </div>
        </div>
    );
}
    export default DividedExpense;