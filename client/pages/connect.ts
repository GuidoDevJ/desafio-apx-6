import "../components/buttom/button"
import"../components/presentacionTitle/presentacion"
import"../components/papel-hand/hand"
import"../components/piedra-hand/piedra"
import"../components/tijeras-hand/tijeras"
import"../components/custom-text/text"
import "../components/header/header"
import { state } from "../state"

export const Connect=(params)=>{
    const roomId = state.getState()
    const div = document.createElement("div")
    const style = document.createElement("style")
    div.classList.add("contenedor")
    
    div.innerHTML = `
    <div class="text">
        <h3>Compartí el código:</h3>
        <h2>${roomId.roomId}</h2>
        <h3>Con tu contrincante</h3>
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
        flex-direction:column;
        align-items: center;
        justify-content: space-evenly;
    }
    .text h3{
        font-size:35px;
        font-weight:600;
    }
    .text h2{
        font-size:48px;
        font-weight:700;
    }
    `
    
    div.appendChild(style)
    
    return div
}