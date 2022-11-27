customElements.define("custom-header",
    class extends HTMLElement{
        shadow=this.attachShadow({"mode":"open"})
        datos = {}
        constructor(){
            super()
            this.render()
        }
        render(){
            // let player1 = this.getAttribute("player1") 
            // let player2 = this.getAttribute("player2") 
            // let point1 = this.getAttribute("point1") 
            // let point2 = this.getAttribute("point2") 
            // let roomId = this.getAttribute("roomId")
            let div = document.createElement("div")
            div.classList.add("container")
            let style = document.createElement("style")

            style.innerHTML = `
            .container{
                width:100%;
            }
                .head{
                    width:100vw;
                    height:10vh;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 10vh;
                }
                .namesPoints{
                    text-align:center;
                }
                .namesPoints p {
                    font-size:24px;
                    font-weight:600;
                }
                .namesPoints p:nth-child(1) {
                    margin-bottom:0px;
                }
                .namesPoints p:nth-child(2) {
                    margin-top:0px;
                }
                .numRoom{
                    text-align:center;
                    font-size:24px;
                    font-weight:600;

                }
                .numRoom p:nth-child(1) {
                    margin-bottom:0px;

                }
                .numRoom p:nth-child(2) {
                    margin-top:0px;

                }
            `


            div.innerHTML = `

            <header class="head">
                <div class="namesPoints">
                    <p>Marce :<span>0</span></p>
                    <p>Celese :<span></span>0</p>
                </div>
                <div class="numRoom">
                    <p>Sala</p>
                    <p>12312312</p>
                </div>
            </header>
            `
            this.shadow.appendChild(style)
            this.shadow.appendChild(div)
        }
    }
)