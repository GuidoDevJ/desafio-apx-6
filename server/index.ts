import {nanoid} from "nanoid"
import * as express from "express"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config()
const app = express()

app.use(express.json())

console.log(process.env.rtdbKey)