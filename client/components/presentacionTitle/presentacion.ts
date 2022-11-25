customElements.define("custom-title",
class  extends HTMLElement{
    shadow = this.attachShadow({mode:"open"})
    constructor(){
        super()
        this.render()
    }
    render(){
        let image = require("url:../../images/Piedra-Papel-Tijera.svg")
        let div = document.createElement("div")
        div.innerHTML  =`
            <div class="img">
            </div>
        `
        const img = div.querySelector(".img") as any
        img.innerHTML = `
        <img src=${image}>
        `
        this.shadow.appendChild(div)
    }
}
)