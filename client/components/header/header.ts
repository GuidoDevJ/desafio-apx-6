customElements.define("custom-header",
    class extends HTMLElement{
        shadow=this.attachShadow({"mode":"open"})
        datos = {}
        constructor(){
            super()
            this.render()
        }
        render(){
            let player1 = this.getAttribute("player1") 
            let play2 = this.getAttribute("play2") || "Oponente"
            let point1 = this.getAttribute("point1") || 0
            let point2 = this.getAttribute("point2") || 0
            let roomId = this.getAttribute("roomId")
            let div = document.createElement("div")
            div.classList.add("container")
            let style = document.createElement("style")

            style.innerHTML = `
            
                .head{
                    width:100vw;
                    height:17vh;
                    background-color:red;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 20vh;
                }
                .namesPoints, .numRoom{
                    width:100%;
                    height:100%;
                }
                .namesPoints{
                    text-align:center;
                }
                .namesPoints p {
                    font-size:24px;
                    font-weight:600;
                    margin-bottom:0px;
                    margin-top:0px;
                }
             
                .numRoom{
                    text-align:center;
                    font-size:24px;
                    font-weight:600;

                }
                .numRoom p{
                    margin-bottom:0px;
                    margin-top:0px;
                }
            `


            div.innerHTML = `

            <header class="head">
                <div class="namesPoints">
                    <p>${player1} :<span>0</span></p>
                    <p>${play2} :<span></span>0</p>
                </div>
                <div class="numRoom">
                    <p>Sala</p>
                    <p>${roomId}</p>
                </div>
            </header>
            `
            this.shadow.appendChild(style)
            this.shadow.appendChild(div)
        }
    }
)