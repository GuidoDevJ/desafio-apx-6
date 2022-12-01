import * as key from "../server/key.json"
import * as admin from "firebase-admin"
import firebase from 'firebase/compat/app';
import "firebase/compat/database"


admin.initializeApp({
    credential: admin.credential.cert(key as any),
    
});
firebase.initializeApp({
    databaseURL: "https://desafio-6-9b431-default-rtdb.firebaseio.com/",
})

const firestore =   admin.firestore()
const rtdb = firebase.database()
export {rtdb,firestore}