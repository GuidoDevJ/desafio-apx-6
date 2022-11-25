type Jugada = "piedra" | "tijeras" | "papel"
type Result = "empataste" | "ganaste" | "perdiste"

const state ={
    data:{
        currentMoves:{
            myPlay:"",
            computerPlay:"",
        },
        result:[],
        historyScore: {
            jugador: 0,
            computadora: 0,
        },
    },
    listeners:[],
    init(){
        let data = localStorage.getItem("save-score")
        if(data === null){
            console.log("Estas por iniciar el juego")
        }if(data){
            this.data.historyScore = JSON.parse(data)
            return
        }
        localStorage.setItem("save-score",JSON.stringify(this.data.historyScore))
    },
    moveGame(SelectHand: Jugada){
        let currentMovements = this.getState()
        currentMovements.currentMoves.myPlay = SelectHand
        const moveComputer=()=>{
            let options = ["piedra","tijeras","papel"]
            let randomNumer = Math.floor((Math.random() * (2 - 0 + 1)) + 0)
            return options[randomNumer]
        }
        currentMovements.currentMoves.computerPlay = moveComputer()
    },

    whoWins(movePlayer:Jugada,moveComputer:Jugada){
        let data = this.getState()
        let resultado : Result[] = data.result
        let tijeraGanaJugador : boolean = movePlayer === "tijeras" && moveComputer === "papel"
        let papelGanaJugador : boolean = movePlayer ==="papel" && moveComputer === "piedra"
        let piedraGanaJugador : boolean = movePlayer ==="piedra" && moveComputer === "tijeras"
        let jugadorGana = [tijeraGanaJugador,papelGanaJugador,piedraGanaJugador].includes(true)

        let tijerasEmpate : boolean = movePlayer === "tijeras" && moveComputer === "tijeras"
        let papelEmpate : boolean = movePlayer ==="papel" && moveComputer === "papel"
        let piedraEmpate : boolean = movePlayer ==="piedra" && moveComputer === "piedra"
        let empate = [tijerasEmpate,papelEmpate,piedraEmpate].includes(true)
        if(jugadorGana){
            resultado[0] = "ganaste"
        }else if(empate){
            resultado[0] = "empataste"
        }else{
            resultado[0] = "perdiste"
        }
        this.pushToHistory(resultado[0])

    },
    getState(){
        return this.data
    },
    setState(newItem){
        this.data = newItem


    },
    suscribe(callback : ()=>{}){
        this.data.listeners.push(callback)
    },
    pushToHistory(resultado :Result){
        if(resultado === "ganaste"){
            this.data.historyScore.jugador++
        }else if(resultado === "perdiste"){
            this.data.historyScore.computadora++
        }
        this.saveScore()
    },
    saveScore(){
        let score = this.getState().historyScore
        localStorage.setItem("save-score",JSON.stringify(score))
    },
    deleteScore(){
    const deleData = {jugador:0,computadora:0}
    localStorage.setItem("save-score",JSON.stringify(deleData))
    }
}

export {state}