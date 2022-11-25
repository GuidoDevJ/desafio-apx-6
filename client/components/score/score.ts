customElements.define("custom-score",
class  extends HTMLElement{
    shadow = this.attachShadow({mode:"open"})
    constructor(){
        super()
        this.render()
    }
    render(){
        let div = document.createElement("div")
        let style = document.createElement("style")
        let player = this.getAttribute("player") || 0
        let computer = this.getAttribute("computer") || 0

        style.innerHTML = `
        .score{
            width:259px;
            heigth:130px;
            border:10px solid #000;
            background-color:#fff;
            font-family:Odibee Sans;
        }
        .score h2{
            font-size:55px;
            text-align:center;
        }
        .score p span{
            font-size:45px;
            font-family:Odibee Sans;

            
        }
        .score p{
            text-align:right;
            padding:0 10px;
        }
        `
        div.innerHTML = `
            <div class="score">
                <h2>Score</h2>
                <p><span class="jugador">Vos: ${player}</span></p>
                <p><span class="maquina">Machine: ${computer}</span></p>
            </div>
        `
        this.shadow.appendChild(style)
        this.shadow.appendChild(div)

    }
}
)