import "../components/buttom/button";
import "../components/input/input";
import "../components/presentacionTitle/presentacion";
import "../components/papel-hand/hand";
import "../components/piedra-hand/piedra";
import "../components/tijeras-hand/tijeras";
import { state } from "../state";
import Swal from "sweetalert2";

export const EnterRoom = (params) => {
  const div = document.createElement("div");
  const style = document.createElement("style");
  div.classList.add("contenedor");

  div.innerHTML = `
    <custom-title></custom-title>
    <div class="buttons">
    <input placeholder="Nombre" class="input name"/>
    <input placeholder="Codigo" class="input code"/>
    <custom-button class="btnEl">Ingresar a la sala</custom-button>
    </div>
    <div class="hands">
        <hand-piedra></hand-piedra>
        <hand-tijeras></hand-tijeras>
        <papel-hand></papel-hand>
    </div>
    `;
  style.innerHTML = `
    .contenedor{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100vh;
        padding: 85px 0 0 0;
        overflow:hidden;
    }
    .buttons{
        width:100%;
        height: 30vh;
        display:flex;
        flex-direction:column;
        align-items: center;
        justify-content: space-between;
    }
    .buttons h2{
        font-size:42px;
        font-weight:bold;
    }
    .hands{
        width:80%;
        display:flex;
        justify-content: space-between;
        position:relative;
        top:15px;
    }
    .input{
        width:315px;
        height:70px;
        outline: 10px solid;
        font-size:40px;
        text-align:center;
    }
    `;
  const btn = div.querySelector(".btnEl");
  const name = div.querySelector(".name") as any;
  const code = div.querySelector(".code") as any;
  btn?.addEventListener("click", (e) => {
    if (name.value === "") {
      Swal.fire({
        title: "Por favor ingrese algun nombre",
        backdrop: true,
        icon: "warning",
      });
    } else {
      state.setNombreOwn(name.value);

      state.sincronizarDatos(code.value, () => {
        state.singIn(() => {
          state.joinToRoom(() => {
            params.goTo("/intructions");
          },()=>{
            params.goTo("/error");
          });
        });
      });
    }
  });
  div.appendChild(style);
  return div;
};
