import * as express from "express";
import { firestore, rtdb } from "./db";
import { nanoid } from "nanoid";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import * as cors from "cors";
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

dotenv.config();

app.use(express.json());

app.use(express.static("public"));

const userCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");

// Base de Datos

app.post("/singup", (req, res) => {
  const nombre = req.body.nombre;
  userCollection
    .where("nombre", "==", nombre)
    .get()
    .then((result) => {
      if (result.empty) {
        userCollection
          .add({
            nombre,
          })
          .then((newUser) => {
            res.json({
              id: newUser.id,
              new: true,
            });
          });
      } else {
        res.status(400).json({
          message: "user has already exist",
          status: 400,
        });
      }
    });
});
app.post("/auth", (req, res) => {
  const nombre = req.body.nombre;
  userCollection
    .where("nombre", "==", nombre)
    .get()
    .then((result) => {
      if (result.empty) {
        res.status(404).json({
          message: "user dosnt exist",
        });
      } else {
        res.json({
          id: result.docs[0].id,
        });
      }
    });
});

app.post("/rooms", (req, res) => {
  const { gameState } = req.body;
  userCollection
    .doc(gameState.userId.toString())
    .get()
    .then((snap) => {
      if (snap.exists) {
        let newRoom = rtdb.ref("/rooms/" + nanoid());
        newRoom
          .set({
            owner: gameState,
          })
          .then(() => {
            const roomLongId = newRoom.key;
            const roomId = 1000 + Math.floor(Math.random() * 999);
            roomsCollection
              .doc(roomId.toString())
              .set({
                rtdbRoomId: roomLongId,
              })
              .then(() => {
                res.json({
                  id: roomId.toString(),
                  idLarge: roomLongId,
                });
              });
          });
      } else {
        res.status(402).json({
          message: "El usuario no existe",
        });
      }
    });
});

app.post("/rooms/:rtdbId", (req, res) => {
  const { rtdbId } = req.params;
  const { gameState } = req.body;
  rtdb
    .ref("/rooms/" + rtdbId)
    .update({ guest: gameState })
    .then(() => {
      res.json("Salio todo ok");
    });
});
app.get("/rooms/:rtdbId/realtime", (req, res) => {
  const { rtdbId } = req.params;
  rtdb
    .ref("/rooms/" + rtdbId)
    .on("value",snapShot=>{
      const data = snapShot.val()
      res.json(data)
    })
  
});
app.get("/rooms/:roomId", (req, res) => {
  const chatRoomId = req.params.roomId;
  const chatRoomDoc = roomsCollection.doc(`${chatRoomId.toString()}`);
  chatRoomDoc.get().then((docSnap) => {
    if (docSnap.exists) {
      const snapData = docSnap.data();
      res.status(200).json(snapData);
    } else {
      res.status(404).json({
        message:
          "ID de sala incorrecto. Compruebe que el ID se ingresó correctamente de lo contrario cree una sala",
      });
    }
  });
});

app.post("/rooms/:id/play", (req, res) => {
  const { gameState } = req.body;

  const roomRef = rtdb.ref(`rooms/${gameState.privateId}`);

  //updateo la data en la rtdb
  if (gameState.owner) {
    roomRef.update({
      owner: gameState,
    });
    return res.json({ success: true });
  } else if (gameState.owner == false) {
    roomRef.update({
      guest: gameState,
    });
    return res.json({ success: true });
  }
});

app.get("/history/:id",(req,res)=>{
    const id = req.params.id
    const documentRefe = roomsCollection.doc(id.toString())
    
    documentRefe.get().then((documentSnapshot)=>{
      if(documentSnapshot.exists){
        res.status(200).json(
          documentSnapshot.data()
        )
      }else{
        res.status(400).json({message:"Lo siento, pruebe con otra id"})
      }
    })
})
app.post("/history/:id",(req,res)=>{
    const id = req.params.id
    const{scoreboard} = req.body
    const documentRefe = roomsCollection.doc(id.toString())
    
    documentRefe.set({scoreboard}).then((resl)=>{
      res.status(200).json(resl.writeTime)
    })
})

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
  console.log("Escuchando los cambios");
});
