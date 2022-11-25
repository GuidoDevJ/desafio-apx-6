customElements.define(
    'text-long',
    class extends HTMLElement {
        shadow = this.attachShadow({ mode: 'open' });
        constructor() {
            super();
            this.render();
        }
        render() {
            const imagenSrc = require("url:../../images/text-largo.svg");

            const div = document.createElement("div")
            div.innerHTML = `
            <div class="imgTitle">
            </div>
            `
            const imgTitle = div.querySelector(".imgTitle") as any
            imgTitle.innerHTML= `
                <img src="${imagenSrc}"/>
            `
            this.shadow.appendChild(div)
        }
    }
);