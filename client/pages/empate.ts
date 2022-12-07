import "../components/score/score"
import"../components/star-empate/star-empate"
import "../components/buttom/button"
import {state} from "../state"
export const Empate=(params)=>{
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
            background-color: var(--fondo-gris);
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:space-evenly;
        }
        @media(min-width:960px){
            .contenedor{
                height: 100vh;
            }
        }
        @media (min-width:960px){
            .btnEl{
                margin-top:10px;
                margin-bottom:10px;
            }
        }
    `
    div.classList.add("contenedor")
    div.innerHTML = `
        <star-empate></star-empate>
        <custom-score player=${player} computer=${opponent}></custom-score>
        <custom-button class="btnEl">Volver a jugar</custom-button>
    `
    let btn = div.querySelector(".btnEl") as Element
    let reset = div.querySelector(".reiniciar") as Element

    btn.addEventListener("click",e=>{
        params.goTo("/intructions")
    })
    // reset.addEventListener("click",e=>{
    //     // state.deleteScore()
    //     params.goTo("/home")
    //     state.init()
    // })
    div.appendChild(style)
    return div
}