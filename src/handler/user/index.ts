import { Socket } from "socket.io";
import { events } from "../../globals";

class User {
  socket: Socket;
  index: string;
  id: string;
  name: string;
  side: 'white' | 'black';
  gameID: string;
  
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

  setName(name) {
    this.name = name;
  }

  setGameId(gameId) {
    this.gameID = gameId;
  }

  updateSocket(socket: Socket) {
    this.socket.eventNames().forEach((event: string) => {
      const callbacks = this.socket.listeners(event);
      callbacks.forEach((callback) => {
        socket.on(event, callback);
      });
    });
    this.socket.removeAllListeners();
    this.socket = socket;
  }

  removeListeners(names: events[]) {
    names.forEach((event) => {
      console.log('removing listener', event)
      this.socket.removeAllListeners(event);
    });
  }
}

export default User;