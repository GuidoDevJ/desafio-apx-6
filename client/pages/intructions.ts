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
    const dataLocal = JSON.parse(localStorage.getItem("dataLocal") as any)
    let nameOwner;
    let nameGuest;

    if(cs.gameState.owner){
        nameOwner = cs.gameState.name
        nameGuest = cs.gameState.opponentName
    }
    if(cs.gameState.owner === false){
        nameOwner = cs.gameState.opponentName
        nameGuest = cs.gameState.name

    }

    const {scoreboard} = dataLocal
    const div = document.createElement("div")
    const style = document.createElement("style")
    div.classList.add("contenedor")
    
    div.innerHTML = `
    <custom-header player1="${nameOwner}" play2="${nameGuest}" roomId="${cs.gameState.publicId}" point1="${scoreboard.owner}" point2="${scoreboard.guest}"></custom-header>
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