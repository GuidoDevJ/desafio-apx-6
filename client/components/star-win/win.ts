customElements.define("star-win",
class extends HTMLElement{
    shadow = this.attachShadow({mode:"open"})
    constructor(){
        super()
        this.render()
    }
    render(){
        let imgUrl = require("url:../../images/resultado-ganaste.svg")
        let style = document.createElement("style")
        style.innerHTML = `
        img{
            width:230px;
            height:230px;
        }
        `
        let img = document.createElement("img")
        img.src = imgUrl
        this.shadow.appendChild(style)
        this.shadow.appendChild(img)
    }
}
)