import "../components/buttom/button"
import "../components/input/input"
import"../components/presentacionTitle/presentacion"
import"../components/papel-hand/hand"
import"../components/piedra-hand/piedra"
import"../components/tijeras-hand/tijeras"
import { state } from "../state"

export const NewRoom=(params)=>{
    const div = document.createElement("div")
    const style = document.createElement("style")
    div.classList.add("contenedor")
    
    div.innerHTML = `
    <custom-title></custom-title>
    <div class="buttons">
    <h2>Tu Nombre</h2>
    <input type="text" class="input"></input>
    <custom-button class="btnEl">Empezar</custom-button>
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
        padding: 85px 0 0 0;
        overflow:hidden;
    }
    .buttons{
        width:100%;
        height: 30vh;
        display:flex;
        flex-direction:column;
        align-items: center;
        justify-content: space-between;
    }
    .buttons h2{
        font-size:42px;
        font-weight:bold;
    }
    .hands{
        width:80%;
        display:flex;
        justify-content: space-between;
        position:relative;
        top:15px;
    }
    .input{
        width:315px;
        height:70px;
        outline: 10px solid;
        font-size:40px;
        text-align:center;
    }
    `
    const btn = div.querySelector(".btnEl") as HTMLElement
    const input = div.querySelector(".input") as any
    btn.addEventListener("click",e=>{
        state.setNombre(input.value)
        state.singIn(()=>{
            state.askNewRoom(()=>{
                params.goTo("/connect")
            })
        })
    })
    div.appendChild(style)
    return div
}