import "./css/index.css";
import "./css/chat.css";
import "./thirdparty/jscolor";
import { showHome, hideHome } from "./pages/home";
import { showDrawing, hideDrawing } from "./pages/drawing";
import { hideGameplay, showGameplay } from "./pages/gameplay";
import { client } from "./utils/networking";
import { State } from "../server/rooms/State";

const gameModes = ['2minutes', '5minutes', '1hour', '1day', '1week'];


// document.getElementById("landing-app").requestFullscreen();

function playerName(): string {
  let playerName = (document.getElementById('player-name') as HTMLInputElement).value;
  playerName = playerName.substring(0, Math.min(playerName.length, 12));

  if (playerName === '') {
      console.warn(`Starting with player name, assuming dev environment`);
      playerName = `Player ${Math.round(Math.random() * 1000)}`;
  }
  return playerName;
}

function create(): void {
  // client.create("kamran").then(room => {
      // console.log(room, room.sessionId, "joined", room.name);
      showGameplay("kamran");
      hideHome();
  // }).catch(e => {
  //     console.log("Error", e);
  // });
}

// const landingForm: HTMLInputElement = document.getElementById('landing-form') as HTMLInputElement;
// landingForm.addEventListener('submit', function(event) {
//   console.log(event);
//   event.preventDefault();
//   start();
// });

document.getElementById("create").addEventListener("click", function(event){
  event.preventDefault();
  create();
});
// document.getElementById("join").addEventListener("click", function(event){
//   event.preventDefault();
//   create();
// });

/**
 * Navigation
 */
// window.addEventListener("hashchange", (e) => {
//   const hash = window.location.hash.substr(1);
//   if (hash.length === 0) {
//     showHome();
//     hideGameplay();
//     hideDrawing();

//   } else if (gameModes.indexOf(hash) !== -1) {
//     showGameplay(hash);
//     hideHome();
//     hideDrawing();

//   } else {
//     showDrawing(hash);
//     hideHome();
//   }
// });

// showHome();