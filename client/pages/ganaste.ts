import "../components/score/score"
import"../components/star-win/win"
import "../components/buttom/button"
import {state} from "../state"

export const Ganaste=(params)=>{
    let stateAct = state.getState().historyScore
    let player = stateAct.jugador
    let machine = stateAct.computadora
    let div = document.createElement("div")
    let style = document.createElement("style")
    style.innerHTML = `
        .contenedor{
            width:${100}vw;
            height: ${100}vh;
            background-color: var(--fondo-verde);
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
        <star-win></star-win>
        <custom-score player=${player} computer=${machine}></custom-score>
        <custom-button class="btnEl">Volver a jugar</custom-button>
        <custom-button class="reiniciar">Reset Score</custom-button>
    `
    let btn = div.querySelector(".btnEl") as Element
    let reset = div.querySelector(".reiniciar") as Element

    btn.addEventListener("click",e=>{
        params.goTo("/intructions")
    })
    reset.addEventListener("click",e=>{
        state.deleteScore()
        params.goTo("/home")
        state.init()
    })
    div.appendChild(style)
    return div
}