import * as  express from "express"
// import { bdrt,fireStore } from "./db.js"
import { nanoid } from 'nanoid'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import * as cors from "cors"
const app = express()
const port = 3001
app.use(cors())
app.use(express.json())

dotenv.config()

app.use(express.json())

app.use(express.static("public"));

app.get("*", (req, res) => {
	res.sendFile(__dirname+"/public/index.html");
});

app.listen(port,()=>{
    console.log("Escuchando los cambios")
})