import "../components/buttom/button"
import"../components/presentacionTitle/presentacion"
import"../components/papel-hand/hand"
import"../components/piedra-hand/piedra"
import"../components/tijeras-hand/tijeras"

export const WelcomePage=(params)=>{
    const div = document.createElement("div")
    const style = document.createElement("style")
    div.classList.add("contenedor")
    
    div.innerHTML = `
    <custom-title></custom-title>
    <div class="buttons">
    <custom-button class="btnNewGame">Nuevo Juego</custom-button>
    <custom-button class="btnEnterRoom">Ingresar a una sala</custom-button>
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
        height: 16vh;
        display:flex;
        flex-direction:column;
        align-items: center;
        justify-content: space-between;
    }
    .hands{
        width:80%;
        display:flex;
        justify-content: space-between;
        position:relative;
        top:15px;
    }
    `
    const btnNewGame = div.querySelector(".btnNewGame") as HTMLElement
    const btnEnterRoom = div.querySelector(".btnEnterRoom") as HTMLElement
    btnNewGame.addEventListener("click",e=>{
        params.goTo("/newroom")
    })
    btnEnterRoom.addEventListener("click",e=>{
        params.goTo("/enterroom")
    })
    div.appendChild(style)
    return div
}