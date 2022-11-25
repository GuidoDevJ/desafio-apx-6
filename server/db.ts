import { nanoid } from "nanoid";
import * as admin from "firebase-admin"
import firebase from 'firebase/compat/app';
import "firebase/compat/database"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


admin.initializeApp({
    credential: admin.credential.cert("./key.json"),
    
});
firebase.initializeApp({
    databaseURL: "https://desafio-6-9b431-default-rtdb.firebaseio.com/",
})

const firestore =   admin.firestore()
const rtdb = firebase.database()

// console.log(process.env.rtdbKey)


const userCollection = firestore.collection("users")

userCollection.add({nombre:"Guido"}).then(reference=>{
    rtdb.ref("rooms/tVUZ_A72dRBbhFc_56noY")
    .push({name:"Maria",jugada:"tijeras"})
})