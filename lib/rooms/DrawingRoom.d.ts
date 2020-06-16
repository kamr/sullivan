import { Room, Client } from "colyseus";
import { State } from "./State";
export declare class DrawingRoom extends Room<State> {
    autoDispose: boolean;
    lastChatMessages: string[];
    onCreate(options: any): void;
    onJoin(client: Client, options: any): void;
    onMessage(client: Client, message: any): void;
    countdown(): void;
    onLeave(client: Client): void;
    onDispose(): Promise<void>;
}
