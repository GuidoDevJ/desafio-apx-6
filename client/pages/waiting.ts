import "../components/buttom/button"
import"../components/presentacionTitle/presentacion"
import"../components/papel-hand/hand"
import"../components/piedra-hand/piedra"
import"../components/tijeras-hand/tijeras"
import"../components/custom-text/text"
import "../components/header/header"
import { state } from "../state"

export const Waiting=(params)=>{
    // Crear un player que venga del state
    let player = state.getState().nombre
    const div = document.createElement("div")
    const style = document.createElement("style")
    div.classList.add("contenedor")
    
    div.innerHTML = `
    <custom-header></custom-header>
    <div class="text">
        <p>Esperando a que Paula presione ¡Jugar!...</p>
    </div>
    <div class="hands">
        <hand-piedra></hand-piedra>
        <hand-tijeras></hand-tijeras>
        <papel-hand></papel-hand>
    </div>
    `
    style.innerHTML=`
    .contenedor{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100vh;
        overflow:hidden;
    }
    .hands{
        width:80%;
        display:flex;
        justify-content: space-between;
        position:relative;
        top:15px;
    }
    .text{
        width:100%;
        height: 30vh;
        display:flex;
        align-items: center;
        justify-content: center;
        font-size:35px;
        font-weight:700;
    }
    .text p {
        width:300px;
    }
   
    `
    
    div.appendChild(style)
    
    return div
}