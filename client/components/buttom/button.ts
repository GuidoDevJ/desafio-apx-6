export class Button extends HTMLElement{
    shadow = this.attachShadow({mode: 'open'});
    constructor(){
        super()
        this.render()
    }
    render(){
        let text = this.textContent
        const div = document.createElement("div")
        const style = document.createElement("style")
        style.innerHTML = `
        .btn{
            width: ${332}px;
            heigth: 87px;
            background-color: var(--fondo-azul);
            border:5px solid #001997;
            text-align:center;
            color:white;
            padding:5px 0;
            font-size:45px;
            font-family:Odibee Sans;
        }
        `
        div.innerHTML = `
        <button class="btn"> ${text}</button>
        `
        this.shadow.appendChild(style)
        this.shadow.appendChild(div)
    }

}
customElements.define("custom-button",Button)