import { rtdb } from "./db";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import Swal from 'sweetalert2';
dotenv.config()

type Jugada = "piedra" | "tijeras" | "papel";
type Result = "empataste" | "ganaste" | "perdiste";

const BASE_URL = process.env.PORT || "http://localhost:3001/";

const state = {
  data: {
    gameState: {

      name: "mock",
      play: "",
      userId: "",
      online: false,
      ready: false,
      owner: true,
      publicId: "",
      privateId: "",
      opponentName: "",
      opponentPlay: "",
      lastGameOwnerResult: "",
      lastGameGuestResult: "",
    },
    gameReady: false,
    playersReady: false,
    scoreboard: {
      owner: 0,
      guest: 0,
    },
  },
  listeners: [],
  init() {
    let data = localStorage.getItem("dataLocal");
    if (data === null) {
      console.log("Estas por iniciar el juego");
    }
    if (data) {
      this.data = JSON.parse(data);
      return;
    }
    localStorage.setItem("dataLocal", JSON.stringify(this.data));
  },

  getState() {
    return this.data;
  },
  setState(newItem) {
    this.data = newItem;
  },
  saveData() {
    const cs = this.getState();
    localStorage.setItem("dataLocal", JSON.stringify(cs));
  },
  // deleteScore(){
  // const deleData = {jugador:0,computadora:0}
  // localStorage.setItem("save-score",JSON.stringify(deleData))
  // },
  setNombreOwn(name: string) {
    const cs = this.getState();
    cs.gameState.name = name;
    this.setState(cs);
  },
  singIn(cb?) {
    const cs = this.getState();
    if (cs.gameState.name) {
      fetch(BASE_URL + "singup", {
        method: "post",
        body: JSON.stringify({
          nombre: this.data.gameState.name,
        }),
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          cs.gameState.userId = data.id;
          cs.gameState.online = true;
          this.setState(cs);
          if (cb) {
            cb();
          }
        });
    } else {
      console.error("No hay datos en el state");
      cb();
    }
  },
  async askNewRoom(cb?) {
    const { gameState } = this.getState();

    const rawPublicRoomId = await fetch(BASE_URL + "rooms", {
      method: "post",
      body: JSON.stringify({
        gameState,
      }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    const pId = await rawPublicRoomId.json();
    const { id, idLarge } = await pId;
    this.data.gameState.publicId = id;
    this.data.gameState.privateId = idLarge;
    if (cb) {
      cb();
    }
  },
  connectarStateToRtdb(cb) {
    const cs = this.getState();
    let rtdbkey = cs.gameState.privateId;
    fetch(BASE_URL + `rooms/${rtdbkey}`, {
      method: "Post",
      body: JSON.stringify(cs.gameState),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }).then(() => {
      if (cb) {
        cb();
      }
    });
  },
  async sincronizarDatos(id, cb?) {
    const cs = this.getState();
    cs.gameState.publicId = id;
    cs.gameState.owner = false;
    const data = await fetch(BASE_URL + `rooms/${id}`);
    let json = await data.json();
    if (json.message) {
      Swal.fire({
        title:"Ocurrio un error",
        backdrop:true,
        icon:"error",
        html: `
        <b>${json.message}</b>
        `
      });
    } else {
      cs.gameState.privateId = json.rtdbRoomId;
      this.setState(cs);
      if (cb) {
        cb();
      }
    }
  },

  async joinToRoom(cb?,call?) {
    const data = this.getState();
    const { gameState } = data;
    gameState.owner = false;
    data.gameReady = true;

    const numberUser = await fetch(`${BASE_URL}rooms/${gameState.privateId}/realtime`)
    const users = await numberUser.json()
    if(Object.values(users).length === 2){
      Swal.fire("Cuidado esta lleno")
      return call()
      
    }else{
      fetch(BASE_URL + `rooms/${gameState.privateId}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ gameState }),
      }).then(()=>{
  
        this.checkConnections(cb)
      })
      
    } 
  },
  checkConnections(cb?) {
    const cs = this.getState();
    const ref = rtdb.ref(`rooms/${cs.gameState.privateId}`);
    ref.on("value", (snapshot) => {
      let data = snapshot.val();
      if (Object.keys(data).length === 2) {
          if (cs.gameState.name === data.owner.name) {
              cs.gameState.opponentName = data.guest.name;
            }
            if (cs.gameState.name === data.guest.name) {
                cs.gameState.opponentName = data.owner.name;
            }
        this.setGameReadyStatus(true, cb);
      }
    });
  },
  setGameReadyStatus(online: boolean, cb?) {
    let data = this.getState();

    if (online === true) {
      data.gameReady = online;
      if(data.gameState.owner){
        if (location.pathname !== "/connect") return;
      if (location.pathname === "/connect") {
        cb()
      }
      if(data.gameState.owner === false){
        if(location.pathname.includes("/intructions")){
          cb()
        }
      }
      
      }else if(location.pathname === "/enterroom"){
        cb()
      }
    }
    if (online === false) return (data.gameReady = online);
  },
  setReadyStatus(boolean: boolean) {
    const { gameState } = this.getState();
    gameState.ready = boolean;
    fetch(`${BASE_URL}rooms/${gameState.publicId}/play`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ gameState }),
    });
  },
  checkBothPlayersReady(cb?) {
    const cs = this.getState();
    const refe = rtdb.ref(`/rooms/${cs.gameState.privateId}`);
    refe.on("value", (snapShot) => {
      const data = snapShot.val();
      if (data.owner.ready && data.guest.ready) {
        cs.playersReady = true;
        if (location.pathname !== "/waiting") return;
        if (location.pathname === "/waiting") {
          cb();
        }
      }
    });
  },
  setMove(playerMove: Jugada) {
    const { gameState } = this.getState();
    gameState.play = playerMove;
    fetch(`${BASE_URL}rooms/${gameState.publicId}/play`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ gameState }),
    });
  },
  getMovementsFromDb(cb?) {
    const { gameState } = this.getState();
    const refe = rtdb.ref(`/rooms/${gameState.privateId}`);
    refe.on("value", (snapShot) => {
      const data = snapShot.val();
      if (data.owner.play != "" && data.guest.play != "") {
        if (gameState.owner) {
          gameState.opponentPlay = data.guest.play;
        }
        if (gameState.owner === false) {
          gameState.opponentPlay = data.owner.play;
        }
      }
      if (cb) {
        cb();
      }
    });
  },
  whoWins(ownerPlay: string, guestPlay: string) {
    const ownerWinningOutcomes = [
      { ownerPlay: "piedra", guestPlay: "tijera" },
      { ownerPlay: "tijera", guestPlay: "papel" },
      { ownerPlay: "papel", guestPlay: "piedra" },
    ];

    let ownerResult = "perdiste";
    for (const o of ownerWinningOutcomes) {
      if (o.ownerPlay == ownerPlay && o.guestPlay == guestPlay) {
        ownerResult = "ganaste";
      } else if (ownerPlay == guestPlay) {
        ownerResult = "empataste";
      }
    }

    let guestResult = "";
    if (ownerResult == "perdiste") {
      guestResult = "ganaste";
    } else if (ownerResult == "ganaste") {
      guestResult = "perdiste";
    } else if (ownerResult == "empataste") {
      guestResult = "empataste";
    }

    this.setWinner(ownerResult, guestResult);
  },

  // setea en el state quien gano desde la perspectiva del OWNER

  setWinner(resultOfOwner: string, resultOfGuest: string): void {
    const data = this.getState();
    if (resultOfOwner == "empataste") {
      data.gameState.lastGameOwnerResult = resultOfOwner;
      data.gameState.lastGameGuestResult = resultOfGuest;
      return;
    }
    if (resultOfOwner == "ganaste") {
      data.scoreboard.owner++;
      data.gameState.lastGameOwnerResult = resultOfOwner;
      data.gameState.lastGameGuestResult = resultOfGuest;
      this.setHistoryFirestore()
      return this.saveData();
    }
    if (resultOfOwner == "perdiste") {
      data.scoreboard.guest++;
      data.gameState.lastGameOwnerResult = resultOfOwner;
      data.gameState.lastGameGuestResult = resultOfGuest;
      this.setHistoryFirestore()
      return this.saveData();
    }
  },
  setLastResults() {
    const cs = this.getState();
    cs.gameState.lastGameOwnerResult = "";
    cs.gameState.lastGameGuestResult = "";
    cs.gameState.play = "";
    cs.gameState.opponentPlay = "";
    this.setState(cs);
  },
  setHistoryFirestore(){
    const cs = this.getState()
    fetch(`${BASE_URL}history/${cs.gameState.publicId}`,{
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(cs)

    })
  }
};

export { state };
