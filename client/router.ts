import { WelcomePage } from './pages/welcome';
import { Intructions } from './pages/intructions';
import { Play } from './pages/play';
import { Empate } from './pages/empate';
import { Ganaste } from './pages/ganaste';
import { Lose } from './pages/perdiste';
const BASE_PATH = "/desafio-m5";


const routes =[
    {
        path: /\/home/,
        component: WelcomePage,
    
    },
    {
        path: /\/intructions/,
        component: Intructions,
    
    },
    {
        path: /\/play/,
        component: Play,
    
    },
    {
        path: /\/empataste/,
        component: Empate,
    
    },
    {
        path: /\/ganaste/,
        component: Ganaste,
    
    },
    {
        path: /\/perdiste/,
        component: Lose,
    
    },
]

function isGithubPages() {
  return location.host.includes("github.io");
}

export function initRouter(container: Element) {
  function goTo(path) {
    const completePath = isGithubPages() ? BASE_PATH + path : path;
    history.pushState({}, "", completePath);
    handleRoute(completePath);
  }
  function handleRoute(route) {
    const newRoute = isGithubPages() ? route.replace(BASE_PATH, "") : route;
    for(let r of routes){
        if(r.path.test(newRoute)){
            let el = r.component({goTo})
            if(container?.firstChild){
                container.firstChild.remove()
            }
            container?.appendChild(el)
        }
    }
  }
  if (location.host.includes("github.io")) {
    goTo("/home");
} else if (location.pathname == "/") {
    goTo("/home");
} else {
    handleRoute(location.pathname)
}
window.onpopstate = function () {
    handleRoute(location.pathname);
}
}