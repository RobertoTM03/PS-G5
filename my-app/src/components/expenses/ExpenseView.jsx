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
               <div className="covered-expense">
                   <div className="name-expense">
                   <h5 className= "color-expense gap-tag">name</h5>
                   </div>
                   <div className="amount-expense">
                        <h5 className= "color-expense gap-tag">Amount:50.000$</h5>
                   </div>
                   <div>
                    <h5 className= "color-expense gap-tag">Cubierto:P </h5>
                   </div>
                   <div className= "edition-expense gap-tag">
                   <button>Editar</button>
                   </div>
                    <div className= "delete-expense gap-tag ">
                    <button>Eliminar</button>
                    </div>
               </div>

               <div className="pending-expense">
                   <div className="name-expense">
                       <h5 className= "color-expense gap-tag">name</h5>
                   </div>
                   <div className="amount-expense">
                       <h5 className= "color-expense gap-tag">Amount:50.000$</h5>
                   </div>
                   <div className= "contribute-expense gap-tag">
                       <button>Contribute</button>
                   </div>
                   <div className= "edition-expense gap-tag">
                       <button>Editar</button>
                   </div>
                   <div className= "delete-expense gap-tag">
                       <button>Eliminar</button>
                   </div>

               </div>
               <div className="covered-expense">
                   <div className="name-expense">
                       <h5 className= "color-expense gap-tag">name</h5>
                   </div>
                   <div className="amount-expense">
                       <h5 className= "color-expense gap-tag">Amount:50.000$</h5>
                   </div>
                   <div>
                       <h5 className= "color-expense gap-tag">Cubierto: </h5>
                   </div>
                   <div className= "edition-expense gap-tag">
                       <button>Editar</button>
                   </div>
                   <div className= "delete-expense gap-tag ">
                       <button>Eliminar</button>
                   </div>
               </div>

               <div className="pending-expense">
                   <div className="name-expense">
                       <h5 className= "color-expense gap-tag">name</h5>
                   </div>
                   <div className="amount-expense">
                       <h5 className= "color-expense gap-tag">Amount:50.000$</h5>
                   </div>
                   <div className= "contribute-expense gap-tag">
                       <button>Contribute</button>
                   </div>
                   <div className= "edition-expense gap-tag">
                       <button>Editar</button>
                   </div>
                   <div className= "delete-expense gap-tag">
                       <button>Eliminar</button>
                   </div>

               </div>
               <div className="covered-expense">
                   <div className="name-expense">
                       <h5 className= "color-expense gap-tag">name</h5>
                   </div>
                   <div className="amount-expense">
                       <h5 className= "color-expense gap-tag">Amount:50.000$</h5>
                   </div>
                   <div>
                       <h5 className= "color-expense gap-tag">Cubierto: </h5>
                   </div>
                   <div className= "edition-expense gap-tag">
                       <button>Editar</button>
                   </div>
                   <div className= "delete-expense gap-tag ">
                       <button>Eliminar</button>
                   </div>
               </div>

               <div className="pending-expense">
                   <div className="name-expense">
                       <h5 className= "color-expense gap-tag">name</h5>
                   </div>
                   <div className="amount-expense">
                       <h5 className= "color-expense gap-tag">Amount:50.000$</h5>
                   </div>
                   <div className= "contribute-expense gap-tag">
                       <button>Contribute</button>
                   </div>
                   <div className= "edition-expense gap-tag">
                       <button>Editar</button>
                   </div>
                   <div className= "delete-expense gap-tag">
                       <button>Eliminar</button>
                   </div>

               </div>
           </div>
           <div className="expense-list-button">
               <h2 className="color-expense">Añadir Gasto</h2>
           </div>
       </div>


          <Footer/>

    </div>
   );
}