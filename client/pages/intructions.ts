import "../components/buttom/button"
import"../components/presentacionTitle/presentacion"
import"../components/papel-hand/hand"
import"../components/piedra-hand/piedra"
import"../components/tijeras-hand/tijeras"
import"../components/custom-text/text"
import "../components/header/header"
import { state } from "../state"


export const Intructions=(params)=>{
    const cs = state.getState()
    console.log(cs)
    const div = document.createElement("div")
    const style = document.createElement("style")
    div.classList.add("contenedor")
    
    div.innerHTML = `
    <custom-header player1="${cs.gameState.name}" play2="${cs.gameState.opponentName}" roomId="${cs.gameState.publicId}"></custom-header>
    <text-long></text-long>
    <custom-button class="btnEl">Jugar</custom-button>
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
    `
    const btn = div.querySelector(".btnEl")
    btn?.addEventListener("click",e=>{
        state.setReadyStatus(true)
        params.goTo("/waiting")
    })
    div.appendChild(style)
    
    return div
}