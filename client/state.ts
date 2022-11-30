import { rtdb } from "./db"

type Jugada = "piedra" | "tijeras" | "papel"
type Result = "empataste" | "ganaste" | "perdiste"

const BASE_URL = process.env.URL || "http://localhost:3001/"

const state ={
    data: {
        gameState: {
          currentPage: null,
          name: "mock",
          play: "",
          userId: "",
          online: false,
          ready: false,
          owner: true,
          publicId: "",
          privateId: "",
          opponentName: "",
          opponentPlay: null,
          lastGameOwnerResult: null,
          lastGameGuestResult: null,
        },
        gameReady: false,
        playersReady: false,
        scoreboard: {
          owner: 0,
          guest: 0,
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
    },
    setNombreOwn(name:string){
        const cs = this.getState()
        cs.gameState.name = name
        console.log(cs)
        this.setState(cs)
    },
    singIn(cb?){
        const cs = this.getState()
        if(cs.gameState.name ){
            fetch(BASE_URL+ "singup",{
                    method:"post",
                    body:JSON.stringify({
                        nombre:this.data.gameState.name 
                    }),
                    mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
                }).then(data=>{
                    return data.json()
                 }).then(data=>{
                    cs.gameState.userId = data.id
                    cs.gameState.online = true 
                    this.setState(cs)
                    if(cb){
                        cb()
                    }
                 })

        }else{
            console.error("No hay datos en el state")
            cb()
        }
      
    },
    async askNewRoom(cb?){
        const {gameState} = this.getState()

        const rawPublicRoomId = await fetch(BASE_URL+ "rooms",{
                method:"post",
                body:JSON.stringify({
                    gameState
                }),
                mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
            })
            const pId = await rawPublicRoomId.json()
            const {id,idLarge} = await pId
            this.data.gameState.publicId = id
            this.data.gameState.privateId = idLarge
            if(cb){
                cb()
            }
            
    },
    getData(){
        const cs = this.getState()
        fetch(BASE_URL+ "rooms/"+cs.gameState.publicId+"?"+new URLSearchParams({userId:cs.gameState.userId}))
        .then(data=>{
            return data.json()
         }).then(data=>{
            cs.rtdbId = data.rtdbRoomId
            this.setState(cs)
            this.listenRoom()
         })
    },
    connectarStateToRtdb(cb){
        const cs = this.getState()
        console.log(cs.gameState)
        let rtdbkey = cs.gameState.privateId
        fetch(BASE_URL+`rooms/${rtdbkey}`,{
            method:"Post",
            body: JSON.stringify(cs.gameState),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        },)
        .then(()=>{
            if(cb){
                cb()
            }
        })
    },
    async sincronizarDatos (id,cb?){
        const cs = this.getState()
        cs.gameState.publicId = id
        cs.gameState.owner = false
        cs.gameState.online = true
        const data = await fetch(BASE_URL+`rooms/${id}`)
        let json = await data.json()
        console.log(json)
        cs.gameState.privateId = json.rtdbRoomId
        this.setState(cs)
        if(cb){
            cb()
        }
    },
    async joinToRoom(cb?){
        const data = this.getState()
        const {gameState} = data
        gameState.owner = false
        data.gameReady = true
        fetch(BASE_URL+`rooms/${gameState.privateId}`,{
            method:"Post",
            headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({ gameState }),
        })
        this.checkConnections(cb)
    },
    checkConnections(cb?){
        const cs = this.getState()
        const ref = rtdb.ref(`rooms/${cs.gameState.privateId}`)
        // const rtdbRef = rtdb.ref(`rooms/tVUZ_A72dRBbhFc_56noY`);
        ref.on("value", (snapshot) => {
      let data = snapshot.val()
      if(Object.keys(data).length === 2){
        this.setGameReadyStatus(true,cb)
        if(cs.gameState.name === data.owner.name){
            cs.gameState.opponentName = data.guest.name
        }
        if(cs.gameState.name === data.guest.name){
            cs.gameState.opponentName = data.owner.name
        }
      }


    });
    },
     setGameReadyStatus(online: boolean,cb?) {
        let data =  this.getState();
    
        if (online === true) {
          data.gameReady = online;
          if (location.pathname !== "/connect") return;
          if (location.pathname === "/connect") {
            cb("/intructions")
          }
        }
        if (online === false) return (data.gameReady = online);
      },
      setReadyStatus(boolean:boolean){
        const {gameState} = this.getState()
        gameState.ready = boolean;
        fetch(`${BASE_URL}rooms/${gameState.publicId}/play`, {
        method: "post",
        headers: {
        "content-type": "application/json",
        },
        body: JSON.stringify({ gameState }),
    });
        
      },
      checkBothPlayersReady(cb?){
        const cs = this.getState()
        const refe = rtdb.ref(`/rooms/${cs.gameState.privateId}`)
        refe.on("value",snapShot=>{
            const data = snapShot.val()
            if(data.owner.ready && data.guest.ready){
                cs.playersReady = true;
            if (location.pathname !== "/waiting") return;
            if (location.pathname === "/waiting") {
                cb()
            }
            }
        })
      },
      setMove(playerMove:Jugada){
        const {gameState} = this.getState()
        gameState.play = playerMove
        fetch(`${BASE_URL}rooms/${gameState.publicId}/play`,{
            method: "post",
        headers: {
        "content-type": "application/json",
        },
        body: JSON.stringify({ gameState })
        })
         
      }
}

export {state}