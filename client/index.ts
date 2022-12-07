import { state } from './state';
import { initRouter } from './router';
import Swal from 'sweetalert2'
(()=>{
    let root = document.querySelector(".root") as HTMLElement

    state.init()
    initRouter(root)

    // Si los usuarios cierran las pestañas los datos se eliminan
    window.addEventListener("beforeunload", (evento) => {
       localStorage.clear()
    });
})()