import React from "react";
import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";
import './ExpenseView.css';

export default function ExpenseView() {
   return (
      <div className="expense-wrapper">
       <Header/>

       <div className="previous-page-expense">
           <div className="arrow">
               <i className="fa-solid fa-arrow-left icon-black" ></i>
           </div>
           <div className="text-prev-page">
               <h2 className="color-expense">Gastos</h2>
           </div>
       </div>

       <div className="expense-overwiew">
           <h3 className="color-expense">Resumen de gastos:</h3>

           <div className="expense-calculation">
               <div className="expense-calculation-text">
                   <h2  className="color-expense">Gasto Total: </h2>
               </div>
               <div className="expense-calculation-display">
                   <h2  className="color-expense">4.69€</h2>
               </div>
           </div>
       </div>
       <div className="expense-list">
           <div className="expense-list-text">
               <h2 className= "color-expense">Lista de gastos:</h2>
           </div>
           <div className="expense-list-display">
               <div className="covered-expense"></div>
               <div className="pending-expense"></div>
           </div>
           <div className="expense-list-button">
               <h2 className="color-expense">Añadir Gasto</h2>
           </div>
       </div>


          <Footer/>

    </div>
   );
}