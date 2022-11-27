customElements.define("custom-input",
    class extends HTMLElement{
        shadow = this.attachShadow({ mode: 'open' });

        constructor(){
            super()
            this.render()
        }
        render(){
            let div = document.createElement("div")
            let style = document.createElement("style")
            let placeHolder = this.getAttribute("placeHolder")

            style.innerHTML = `
            .input{
                width:315px;
                height:70px;
                outline: 10px solid;
                font-size:40px;
                text-align:center;
            }
            `

            div.innerHTML = `
            <input type="text" class="input" placeholder = ${placeHolder}>
            `
            this.shadow.appendChild(style)
            this.shadow.appendChild(div)
        }
    }
)