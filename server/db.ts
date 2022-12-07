import { nanoid } from "nanoid";
import * as key from "../server/key.json"
import * as admin from "firebase-admin"
import firebase from 'firebase/compat/app';
import "firebase/compat/database"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


admin.initializeApp({
    credential: admin.credential.cert(key as any),
    
});
firebase.initializeApp({
    databaseURL: `${process.env.databaseURL}`,
})

const firestore =   admin.firestore()
const rtdb = firebase.database()

export {
    firestore,rtdb
}

