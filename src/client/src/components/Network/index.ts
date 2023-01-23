import { Move } from "@/types";
import { io } from "socket.io-client";
import { Observer } from "@/components";
import { events } from "@/../../globals";
import { v4 as uuidv4 } from 'uuid';

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
    }

    public init() {
        this._initSocket();
        this._setObservers();
    }

    private _setObservers() {
        this.observer = new Observer();
        this.observer.on(events.join, this.join);
        [
          events.restartRequest,
          events.restartAccept,
          events.restartRefuse,
          events.leave
        ].forEach(event => this.observer.on(event, () => this.socket.emit(event)));
    }

    private _initSocket() {
      let userID = localStorage.getItem('userID');
      if (!userID) {
        userID = uuidv4().toUpperCase();
        localStorage.setItem('userID', userID);
      }
      this.socket = io(this.serverUrl, { query: { userID, side: game.model.sides.user } });
      this.socket.on('connect_error', (err: any) => {
       console.warn(err);
       this.observer.emit(events.disconnected);
      });

      this.socket.on('connect', () => {
        this.observer.emit(events.connected);
      });

      [
        events.gameCreated, 
        events.joinedGame, 
        events.guestJoined, 
        events.restartRequested, 
        events.restartAccepted, 
        events.restartRefused,
        events.opponentLeft
      ].forEach(event => {
        this.socket.on(event, (data: any) => this.observer.emit(event, data))
      });
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

    public join(gameID: string) {
        const userID = localStorage.getItem('userID');
        this.socket.emit(events.join, {gameID, userID });
    }

    public setUserName(name: string) {
        this.socket.emit(events.setUserName, name);
    }
}