import { Room, Client } from "colyseus";
import { State,  Path, BRUSH, DEFAULT_BRUSH } from "./State";
import { Player } from "./Player";
import { generateName, generatePin } from "../utils/util";
// import Drawing from "../db/Drawing";

export class DrawingRoom extends Room<State> {
  // autoDispose = false;
  lastChatMessages: string[] = [];

  onCreate(options) {
    this.setState(new State());
    this.state.countdown = options.expiration;
    this.setSimulationInterval(() => this.countdown(), 1000);

    console.log(`Room ID ${this.roomId}`);
    this.createRoomPin(options.nickname).then((pin) => {
      console.log(`Room Pin ${pin}`);
      this.setMetadata({ roomPin: pin});
      this.state.pin = pin;
      // Is it bad to store in metadata AND state?
    });
  }

  createRoomPin = async (nickname: string): Promise<string> => {
    var pin: string = "";
    var pinAlreadyInUse: boolean = true;
    var nicknameForRoom: string = nickname;
    while (pinAlreadyInUse) {
      var pin: string = generatePin(nicknameForRoom);
      // console.log(this.presence.smembers(pin))

      var pinMembers = await this.presence.smembers(pin);
      console.log(pinMembers)
      pinAlreadyInUse = pinMembers.length > 0;

      if (pinAlreadyInUse) {
        nicknameForRoom += '1';
        console.log(`${pin} already set trying ${nicknameForRoom} ${generatePin(nicknameForRoom)}`)
      }
      else {
        // console.log("get", pin, this.presence.get(pin));
        // this.presence.exists(pin).then((x) => {console.log("exists", pin, x) });
        // this.presence.smembers(pin).then((x) => {console.log("smembers", pin, x) });
        console.log("Pin doesn't exist yet");
        // pinAlreadyInUse = false;
        this.presence.sadd(pin, nicknameForRoom)
        // this.presence.smembers(pin).then((x) => {console.log("smembers", pin, x) });
      }
    }
    return pin;
  }

  onJoin(client: Client, options: any) {
    const player = this.state.createPlayer(client.sessionId);
    player.name = options.nickname || generateName();

    this.lastChatMessages.forEach(chatMsg => this.send(client, ['chat', chatMsg]));
  }

  onMessage(client: Client, message: any) {
    const player: Player = this.state.players[client.sessionId];
    const [command, data] = message;

    // change angle
    if (command === "chat") {
      const chatMsg = `${player.name}: ${data}`;
      this.broadcast(['chat', client.sessionId, chatMsg]);
      this.lastChatMessages.push(chatMsg);

      // prevent history from being 50+ messages long.
      if (this.lastChatMessages.length > 50) {
        this.lastChatMessages.shift();
      }

    } else if (this.state.countdown > 0) {
      if (command === "s") {
        //
        // start new path.
        //
        // store it in the `player` instance temporarily,
        // and assign it to the state.paths once it's complete!
        //
        player.lastPath = new Path();
        player.lastPath.points.push(...data);
        player.lastPath.color = message[2];
        player.lastPath.brush = message[3] || DEFAULT_BRUSH;

      } else if (command === "p") {
        // add point to the path
        player.lastPath.points.push(...data);

      } else if (command === "e") {
        //
        // end the path
        // this is now going to synchronize with all clients
        //
        this.state.paths.push(player.lastPath);
      }
    }
  }

  countdown() {
    if (this.state.countdown > 0) {
      this.state.countdown--;

    } else if (!this.autoDispose) {
      this.autoDispose = true;
      this.resetAutoDisposeTimeout(5);
    }
  }

  onLeave(client: Client) {
    this.state.removePlayer(client.sessionId);
  }

  async onDispose() {
    console.log(`Disposing of room ${this.roomId}`);

    // if (this.state.paths.length > 0) {
    //   await Drawing.create({
    //     paths: this.state.paths,
    //     mode: this.roomName,
    //     votes: 0,
    //   });
    // }
  }

}
