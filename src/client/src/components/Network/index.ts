import { Move } from "@/types";
import { io } from "socket.io-client";
import { Observer } from "@/components";
import { events } from "@/../../globals";

interface MoveIO {
    move: Move,
    side: string,
    id?: string
}
import {boundClass} from 'autobind-decorator'

@boundClass
export class Network {

    socket: any;
    observer: Observer;
    static instance: Network;
    serverUrl: string;
        

    constructor() {
        if (Network.instance) {
            return Network.instance;
        } else {
            Network.instance = this;
        }
        this.serverUrl = process.env.NODE_ENV === 'development' ? process.env.DEV_SERVER : '';
        this._init();
    }

    private _init() {
        this._initSocket();
        this._setObservers();
    }

    private _setObservers() {
        this.observer = new Observer();
        this.observer.on(events.join, this.join);
    }

    private _initSocket() {
      this.socket = io(this.serverUrl);
      this.socket.on('connect_error', (err: any) => {
       console.warn(err);
       this.observer.emit(events.disconnected);
      });

      this.socket.on('connect', () => {
        this.observer.emit(events.connected);
      });
      this.socket.on(events.gameCreated, this.onGameCreated);
      this.socket.on(events.joinedGame, this.onJoinGame);
      this.socket.on(events.guestJoined, this.onGuestJoined);
    }

    public onGuestJoined(data: any) {
        this.observer.emit(events.guestJoined, data);
    }

    public onJoinGame(data: any) {
        this.observer.emit(events.joinedGame, data);
    }

    public onGameCreated(data: any) {
        this.observer.emit(events.gameID, data);
    }

    public emit(event: string, data: any) {
        this.socket.emit(event, data);
    }

    public move(data: MoveIO) {
        data.id = this.socket.id;
        this.socket.emit(events.move, data);
    }

    public on(event: string, callback: Function) {
        this.socket.on(event, callback);
    }

    public leave() {
        this.socket.emit(events.leave);
    }

    public join(gameId: string) {
        this.socket.emit(events.join, {gameId, userId: this.socket.id});
    }

    public setUserName(name: string) {
        this.socket.emit(events.setUserName, name);
    }
}