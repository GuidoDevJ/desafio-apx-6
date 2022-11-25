import * as admin from "firebase-admin"
import firebase from 'firebase/compat/app';
import "firebase/compat/database"


admin.initializeApp({
    credential: admin.credential.cert("./key.json"),
    
});
firebase.initializeApp({
    databaseURL: "https://desafio-6-9b431-default-rtdb.firebaseio.com/",
})

const firestore =   admin.firestore()
const rtdb = firebase.database()

function listenDatabase() {
    // Connection with RTDB
    const rtdbRef = rtdb.ref(`rooms/tVUZ_A72dRBbhFc_56noY`);

    rtdbRef.on("value", (snapshot) => {
      let data = snapshot.val()
      let datos = Object.values(data) as any
      let jugadores = datos.map((el:any)=> el.name)
        if(jugadores.length > 2){
            console.log("Espacio lleno")
        }else{
            console.log("Estoy atento")
        }
    });
}

listenDatabase()