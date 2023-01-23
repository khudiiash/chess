import { v4 as uuidv4 } from 'uuid';
import { Move } from '../../types';
import User from '../user';
import { events } from '../../globals';


class Game {
  
  id: string;
  host: User;
  guest: User;
  players: [User, User];
  moves: Move[] = [];

  constructor(host: User) {
    this.id = uuidv4().toUpperCase();
    this.host = host;
    this.host.setGameId(this.id);
    this.guest = null;
    this.players = [this.host, this.guest];
    this.host.socket.on(events.move, this.onHostMove.bind(this));
    this.host.socket.on(events.leave, this.onHostLeave.bind(this));
  }

  addPlayer(user) {
    if (this.guest) return;
    console.log('adding guest')
    this.guest = user;
    this.guest.socket.on(events.move, this.onGuestMove.bind(this));
    this.guest.socket.on(events.leave, this.onGuestLeave.bind(this));
    user.socket.emit(events.joinedGame, this.joinData);
    this.host.socket.emit(events.guestJoined, this.joinData);
  }

  get joinData() {
    return { 
      host: { name: this.host.name, side: this.host.side }, 
      guest: { name: this.guest.name, side: this.guest.side }, 
      gameID: this.id 
    };
  }

  onHostMove(move: Move) {
    console.log('host move', move)
    this.moves.push(move)
    if (!this.guest) {
      console.error('no guest found', this.id)
      return;
    };
    this.guest.socket.emit(events.move, move);
  }

  onGuestMove(move) {
    console.log('guest move',move)
    this.moves.push(move)
    this.host.socket.emit(events.move, move);
  }

  onHostLeave() {
    console.log('host left')
    this.guest.socket.emit(events.hostLeft);
  }

  onGuestLeave() {
    console.log('guest left')
    this.host.socket.emit(events.guestLeft);
  }
}

export default Game;