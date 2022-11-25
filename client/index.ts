import { state } from './state';
import { initRouter } from './router';
(()=>{
    let root = document.querySelector(".root") as HTMLElement

    state.init()
    initRouter(root)

})()