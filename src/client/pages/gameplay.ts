import { client } from "../utils/networking";
import { Room } from "colyseus.js";
import { State, DEFAULT_BRUSH, BRUSH } from "../../server/rooms/State";
import brushFunctions from "../brushes";

let room: Room<State>;

const countdownEl = document.getElementById('countdown');
const playerListEl = document.getElementById('player-list');

const chatSidebar = document.getElementById('mySidenav');

const chatEl = document.getElementById('chat-entry');
// const chatMessagesEl = gameplay.querySelector('.chat-history').querySelector('ul');
const chatMessagesEl = document.getElementById('chat-list');

chatEl.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = chatEl.querySelector('input[type=text]') as HTMLInputElement;
  room.send(['chat', input.value]);
  input.value = "";
});

// gameplay.querySelector('.lobby-title a').addEventListener("click", (e) => {
//   e.preventDefault();

//   if (room) {
//     room.leave();
//   }

//   location.hash = "#";
// });

/* Set the width of the side navigation to 250px */
let openChat = document.getElementById("open-chat");
openChat.addEventListener("click", (e:Event) => {
  document.getElementById("mySidenav").style.right = "0px";
})

/* Set the width of the side navigation to 0 */
let closeChat = document.getElementById("close-chat");
closeChat.addEventListener("click", (e:Event) => {
  document.getElementById("mySidenav").style.right = "-300px";
})

// const canvas = gameplay.querySelector('.drawing') as HTMLCanvasElement;
// const ctx = canvas.getContext('2d');

// const prevCanvas = gameplay.querySelector('.drawing-preview') as HTMLCanvasElement;
// const prevCtx = prevCanvas.getContext('2d');

// join() {
//   client.getAvailableRooms("battle").then(rooms => {
//     for (var i=0; i<rooms.length; i++) {
//       if (room.metadata && room.metadata.friendlyFire) {
//         //
//         // join the room with `friendlyFire` by id:
//         //
//         var room = client.join(room.roomId);
//         return;
//       }
//     }
//   });
// }

export async function showGameplay(roomName: string) {
  console.log('SHOWGAMEPLAY')
  chatSidebar.classList.remove('hidden');

  // clear previous chat messages.
  chatMessagesEl.innerHTML = "";
  playerListEl.innerHTML = "";

  // clearCanvas(ctx);
  // clearCanvas(prevCtx);

  chatSidebar.classList.add('loading');
  console.log("CREATE ROOM")
  room = await client.create(roomName, {
    nickname: (document.getElementById('username') as HTMLInputElement).value
  });
  console.log(room)
  // room.onStateChange.once(() => chatSidebar.classList.remove('loading'));
  document.getElementById('lobby-mode').innerHTML = `Room ${roomName} ${room.state.pin}`;

  room.state.players.onAdd = (player, sessionId) => {
    const playerEl = document.createElement("li");

    if (sessionId === room.sessionId) { playerEl.classList.add('you'); }
    playerEl.innerText = player.name;
    playerEl.id = `p${sessionId}`;
    playerListEl.appendChild(playerEl);
  }

  room.state.players.onRemove = (player, sessionId) => {
    const playerEl = playerListEl.querySelector(`#p${sessionId}`);
    playerListEl.removeChild(playerEl);
  }

  room.state.onChange = (changes) => {
    changes.forEach(change => {
      if (change.field === "countdown") {
        countdownEl.innerHTML = (change.value > 0)
          ? millisecondsToStr(change.value)
          : "Time is up!";
      }
      // can we avoid checking this every time?
      if (change.field === "pin") {
        document.getElementById('lobby-mode').innerHTML = `Room ${roomName} ${room.state.pin}`;
      }
    });
  };

  // room.state.paths.onAdd = function(path, index) {
  //   brushFunctions[path.brush](ctx, path.color, path.points, false);
  // }

  room.onMessage((message) => {
    // console.log(message)
    const [cmd, ...data] = message;
    if (cmd === "chat") {
      // console.log("from", data[0], "to", room.sessionId)
      const message = document.createElement("p");
      if (data[0] == room.sessionId) {
        message.setAttribute('class', 'from-me');
      }
      else {
        message.setAttribute('class', 'from-them');
      }
      // room.sessionId
      message.innerText = data[1];
      // console.log("from", data[0], "msg", message.innerText);
      // console.log(message)
      chatMessagesEl.appendChild(message);
      chatEl.scrollTop = chatEl.scrollHeight;
    }
  });
}

export function hideGameplay() {
  chatSidebar.classList.add('hidden');
}

export function clearCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function checkRoom() {
  return (room && room.state.countdown > 0);
}

// ctx.lineWidth = 1;
// ctx.lineJoin = ctx.lineCap = 'round';

// var isDrawing, color = 0x000000, brush = DEFAULT_BRUSH, points = [ ];

// prevCanvas.addEventListener("mousedown", (e) => startPath(e.offsetX, e.offsetY));
// prevCanvas.addEventListener("mousemove", (e) => movePath(e.offsetX, e.offsetY));
// prevCanvas.addEventListener("mouseup", (e) => endPath());

// prevCanvas.addEventListener("touchstart", (e) => {
//   var rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
//   var bodyRect = document.body.getBoundingClientRect();
//   var x = e.touches[0].pageX - (rect.left - bodyRect.left);
//   var y = e.touches[0].pageY - (rect.top - bodyRect.top);
//   return startPath(x, y);
// });
// prevCanvas.addEventListener("touchmove", (e) => {
//   var rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
//   var bodyRect = document.body.getBoundingClientRect();
//   var x = e.touches[0].pageX - (rect.left - bodyRect.left);
//   var y = e.touches[0].pageY - (rect.top - bodyRect.top);
//   movePath(x, y)
// });
// prevCanvas.addEventListener("touchend", (e) => endPath());

/**
 * Tools: colorpicker
 */
// gameplay.querySelector('.colorpicker').addEventListener("change", (e) => {
//   color = parseInt("0x" + (e.target as HTMLInputElement).value);
// });

/**
 * Tools: brush
 */
// Array.from(document.querySelectorAll('input[type=radio][name="brush"]')).forEach(radioButton => {
//   radioButton.addEventListener('change', (e) => {
//     brush = (e.target as HTMLInputElement).value as BRUSH;
//   });
// });

// function startPath(x, y) {
//   if (!checkRoom()) { return; }

//   const point = [x, y];
//   room.send(['s', point, color, brush]);

//   clearCanvas(prevCtx);

//   isDrawing = true;
//   points = [];
//   points.push(...point);
// }

// function movePath(x, y) {
//   if (!checkRoom()) { return; }
//   if (!isDrawing) { return; }

//   const point = [x, y];
//   room.send(['p', point]);

//   points.push(...point);
//   brushFunctions[brush](prevCtx, color, points, true);
// }

// function endPath() {
//   room.send(['e']);

//   isDrawing = false;
//   points.length = 0;

//   clearCanvas(prevCtx);
// }


function millisecondsToStr(_seconds) {
  let temp = _seconds;
  const years = Math.floor(temp / 31536000),
    days = Math.floor((temp %= 31536000) / 86400),
    hours = Math.floor((temp %= 86400) / 3600),
    minutes = Math.floor((temp %= 3600) / 60),
    seconds = temp % 60;

  if (days || hours || seconds || minutes) {
    return (years ? years + "y " : "") +
      (days ? days + "d " : "") +
      (hours ? hours + "h " : "") +
      (minutes ? minutes + "m " : "") +
      seconds + "s";
  }

  return "< 1s";
}
