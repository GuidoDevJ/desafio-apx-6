import "../components/score/score"
import"../components/star-perdiste/star-lose"
import "../components/buttom/button"
import {state} from "../state"

export const Lose=(params)=>{
    state.setLastResults()
    state.setReadyStatus(false)
    let cs = JSON.parse(localStorage.getItem("dataLocal") as any)
    let player =null
    let opponent = null
    if(cs.gameState.owner){
        player = cs.scoreboard.owner
        opponent = cs.scoreboard.guest
    } 
    if(cs.gameState.owner === false){
        player = cs.scoreboard.guest
        opponent = cs.scoreboard.owner
    }
    let div = document.createElement("div")
    let style = document.createElement("style")
    style.innerHTML = `
        .contenedor{
            width:${100}vw;
            height: ${100}vh;
            background-color: var(--fondo-rojo);
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:space-evenly;
        }
        @media(min-width:960px){
            .contenedor{
                height: 100vh;
            }
            .btnEl{
                margin-top:10px;
                margin-bottom:10px;
            }
        }
    `
    div.classList.add("contenedor")
    div.innerHTML = `
        <star-lose></star-lose>
        <custom-score player=${player} computer=${opponent}></custom-score>
        <custom-button class="btnEl">Volver a jugar</custom-button>
        <custom-button class="reiniciar">Reset Score</custom-button>
    `
    let btn = div.querySelector(".btnEl") as Element
    let reset = div.querySelector(".reiniciar") as Element
    btn.addEventListener("click",e=>{
        params.goTo("/intructions")
    })
    reset.addEventListener("click",e=>{
        // state.deleteScore()
        params.goTo("/home")
        state.init()
    })
    div.appendChild(style)
    return div
}