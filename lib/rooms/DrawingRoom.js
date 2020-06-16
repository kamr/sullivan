"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const State_1 = require("./State");
const name_generator_1 = require("../utils/name_generator");
const Drawing_1 = __importDefault(require("../db/Drawing"));
class DrawingRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.autoDispose = false;
        this.lastChatMessages = [];
    }
    onCreate(options) {
        this.setState(new State_1.State());
        this.state.countdown = options.expiration;
        this.setSimulationInterval(() => this.countdown(), 1000);
    }
    onJoin(client, options) {
        const player = this.state.createPlayer(client.sessionId);
        player.name = options.nickname || name_generator_1.generateName();
        this.lastChatMessages.forEach(chatMsg => this.send(client, ['chat', chatMsg]));
    }
    onMessage(client, message) {
        const player = this.state.players[client.sessionId];
        const [command, data] = message;
        // change angle
        if (command === "chat") {
            const chatMsg = `${player.name}: ${data}`;
            this.broadcast(['chat', chatMsg]);
            this.lastChatMessages.push(chatMsg);
            // prevent history from being 50+ messages long.
            if (this.lastChatMessages.length > 50) {
                this.lastChatMessages.shift();
            }
        }
        else if (this.state.countdown > 0) {
            if (command === "s") {
                //
                // start new path.
                //
                // store it in the `player` instance temporarily,
                // and assign it to the state.paths once it's complete!
                //
                player.lastPath = new State_1.Path();
                player.lastPath.points.push(...data);
                player.lastPath.color = message[2];
                player.lastPath.brush = message[3] || State_1.DEFAULT_BRUSH;
            }
            else if (command === "p") {
                // add point to the path
                player.lastPath.points.push(...data);
            }
            else if (command === "e") {
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
        }
        else if (!this.autoDispose) {
            this.autoDispose = true;
            this.resetAutoDisposeTimeout(5);
        }
    }
    onLeave(client) {
        this.state.removePlayer(client.sessionId);
    }
    onDispose() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Disposing room, let's persist its result!");
            if (this.state.paths.length > 0) {
                yield Drawing_1.default.create({
                    paths: this.state.paths,
                    mode: this.roomName,
                    votes: 0,
                });
            }
        });
    }
}
exports.DrawingRoom = DrawingRoom;
