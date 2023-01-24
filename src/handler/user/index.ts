import { Socket } from "socket.io";
import { events } from "../../globals";
import Game from "../game";

class User {
  socket: Socket;
  index: string;
  id: string;
  name: string;
  side: 'white' | 'black';
  activeGame: Game;
  game: Game;
  opponent: User;
  
  constructor(socket: Socket, index) {
    this.socket = socket;
    this.index = index;
    this.id = socket.handshake.query.userID as string;
    this.side = socket.handshake.query.side as 'white' | 'black';
    this.name = `Player ${index + 1}`;
  }

  setSide(side: 'white' | 'black') {
    this.side = side;
  }

  setGame(game: Game) {
    this.game = game;
  }

  setName(name) {
    this.name = name;
  }

  setActiveGame(game: Game) {
    this.activeGame = game;
  }

  setOpponent(opponent: User) {
    this.opponent = opponent;
  }

  updateSocket(socket: Socket) {
    this.socket.eventNames().forEach((event: string) => {
      const callbacks = this.socket.listeners(event);
      callbacks.forEach((callback) => {
        socket.on(event, callback);
      });
    });
    this.socket.disconnect();
    delete this.socket;
    this.socket = socket;
  }

  removeListeners(names: events[]) {
    names.forEach((event) => {
      this.socket.removeAllListeners(event);
    });
  }
}

export default User;