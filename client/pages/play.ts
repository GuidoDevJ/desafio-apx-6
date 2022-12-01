import { once } from "events"
import{state} from"../state"

export const Play=(parametro)=>{
    console.log(state.getState())
    let counter = 3
    const intervalo: any = setInterval(() => {
    counter--;
    const contadorEl = div.querySelector(".contador") as any
    contadorEl.textContent = String(counter)
    if (counter === 0) {
      clearInterval(intervalo)
      parametro.goTo("/intructions")
    }
    }, 1000)

    const div = document.createElement("div")
    const style = document.createElement("style")
    div.classList.add("contenedor")

    const imagenPiedra = require("url:../images/piedra.svg")
    const imagenPapel = require("url:../images/papel.svg")
    const imagenTijera = require("url:../images/tijera.svg")



    
    div.innerHTML = `
    <div class="hands-computer hands-disabled">
    <img class="piedra-computadora" src="${imagenPiedra}" />
    <img class="papel-computadora" src="${imagenPapel}" />
    <img class="tijera-computadora" src="${imagenTijera}" />
    </div>
    <div class="contador">${counter}</div>
    <div class="hands hands-jugador">
        <img class="piedra-jugador" src="${imagenPiedra}"/>
        <img class="papel-jugador" src="${imagenPapel}"/>
        <img class="tijera-jugador" src="${imagenTijera}"/>
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
    .contador{
        font-size:100px;
        display:flex;
        justify-content:center;
        align-items:center;
        width:243px;
        height:243px;
        border-radius:50%;
        border:solid #000 23px;
        margin-top:25vh;
    }
    .hands-computer{
        transform:rotate(180deg);
        width:80%;
        display:flex;
        justify-content: space-between;
        position:relative;
    }
    .hands{
        width:80%;
        display:flex;
        justify-content: space-between;
        position:relative;
        top:15px;
    }
    .hands-disabled{
        display:none;
    }
    .hand-selected{
        width:157.02px;
        height:250px;
        transform:translateY(-40px);
        transtion: all ease .3s;
    }
    .hand-selected-computer{
        width:157.02px;
        height:250px;
        transform:translateY(-40px);
        transtion: all ease .3s;
    }
    .hand-no-selected{
        display:none;
    }
    .jugando{
        display:flex;
        justify-content:center;
    }
`

    const images = div.querySelector(".hands-jugador")as any 
    const piedra = div.querySelector(".piedra-jugador")
    const papel = div.querySelector(".papel-jugador")
    const tijeras = div.querySelector(".tijera-jugador")
    const piedraComputer = div.querySelector(".piedra-computadora")
    const papelComputer = div.querySelector(".papel-computadora")
    const tijeraComputer = div.querySelector(".tijera-computadora")
    const handsCompute = div.querySelector(".hands-computer")
    const handsJugador = div.querySelector(".hands-jugador")
    const timerEle = div.querySelector(".contador")
    for(const img of images.children){
        img.addEventListener("click",(e)=>{
            const {gameState} = state.getState()
            const clase = img.getAttribute("class")
            clearInterval(intervalo)
            if(clase === "papel-jugador"){
                state.setMove("papel")
                state.getMovementsFromDb(()=>{
                    if(gameState.opponentPlay !== ""){

                        toWin("papel")
                    }
                })

            }else if(clase === "tijera-jugador"){
                state.setMove("tijeras")
                state.getMovementsFromDb(()=>{
                    if(gameState.opponentPlay !== ""){

                        toWin("tijeras")
                    }
                    
                })



            }else{
                state.setMove("piedra")
                state.getMovementsFromDb(()=>{
                    if(gameState.opponentPlay !== ""){

                        toWin("piedra")
                    }
                })
            }
        },{once})
    }
    
    const toWin=(params)=>{
        const {gameState} = state.getState()
            let player = state.getState().gameState.play
            let computer = state.getState().gameState.opponentPlay

            if(params === "piedra"){
            piedra?.classList.add("hand-selected")
            handsJugador?.classList.add("jugando")
            papel?.remove()
            tijeras?.remove()
        }else if(params === "papel"){
            handsJugador?.classList.add("jugando")
            papel?.classList.add("hand-selected")
            piedra?.remove()
            tijeras?.remove()
        }else if(params === "tijeras"){
            handsJugador?.classList.add("jugando")
            tijeras?.classList.add("hand-selected")
            piedra?.remove()
            papel?.remove()
        }
        
        timerEle?.remove()
        handsCompute?.classList.remove("hands-disabled")

        if(computer === "piedra"){
            piedraComputer?.classList.add("hand-selected-computer")
            papelComputer?.classList.add("hand-no-selected")
            tijeraComputer?.classList.add("hand-no-selected")
            handsCompute?.classList.add("jugando")
        }else if(computer === "papel"){
        papelComputer?.classList.add("hand-selected-computer")
        tijeraComputer?.classList.add("hand-no-selected")
        piedraComputer?.classList.add("hand-no-selected")
        handsCompute?.classList.add("jugando")
        }else if(computer === "tijeras"){
            tijeraComputer?.classList.add("hand-selected-computer")
            piedraComputer?.classList.add("hand-no-selected")
            papelComputer?.classList.add("hand-no-selected")
            handsCompute?.classList.add("jugando")

        }
        if(gameState.owner){
            state.whoWins(player,computer)
        }
        if(gameState.owner === false){
            state.whoWins(computer,player)
        }
        setTimeout(() => {
            let {gameState} = state.getState()
            let result = "empataste"
            if(gameState.owner){
                result = gameState.lastGameOwnerResult
            } 
            if(gameState.owner === false){
                result = gameState.lastGameGuestResult
            }
                parametro.goTo(`/${result}`)
        },1500);
    }
    
    div.appendChild(style)
    return div
}