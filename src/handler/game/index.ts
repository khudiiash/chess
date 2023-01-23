import { v4 as uuidv4 } from 'uuid';
import { Move } from '../../types';
import User from '../user';
import { events } from '../../globals';


class Game {
  
  id: string;
  host: User;
  guest: User;
  moves: Move[] = [];
  active

  constructor(host: User) {
    this.id = uuidv4().toUpperCase();
    this.host = host;
    this.host.setGameId(this.id);
  }

  addPlayer(guest: User) {
    if (this.guest) return;
    this.active = true;
    this.guest = guest;
    this.guest.setGameId(this.id);
    this.setEvents();
    this.guest.socket.emit(events.joinedGame, this.joinData);
    this.host.socket.emit(events.guestJoined, this.joinData);
  }

  setEvents() {
    this.host.removeListeners(this.events);
    this.guest.removeListeners(this.events);
    
    this.players.forEach(player => {
      const opponent = this.players.find(p => p !== player);
      player.socket.on(events.move,           data => opponent.socket.emit(events.move, data));
      player.socket.on(events.leave,          () => opponent.socket.emit(events.opponentLeft));
      player.socket.on(events.restartRequest, () => opponent.socket.emit(events.restartRequested));
      player.socket.on(events.restartAccept,  () => opponent.socket.emit(events.restartAccepted));
      player.socket.on(events.restartRefuse,  () => opponent.socket.emit(events.restartRefused));
    });
  }

  get events() {
    return [events.move, events.leave, events.opponentLeft, events.restartRequest, events.restartRequested, events.restartAccept, events.restartAccepted, events.restartRefuse, events.restartRefused]
  }

  get joinData() {
    return { 
      host: { name: this.host.name, side: this.host.side, id: this.host.id }, 
      guest: { name: this.guest.name, side: this.guest.side, id: this.guest.id }, 
      gameID: this.id 
    };
  }

  get players(): User[] {
    return [this.host, this.guest];
  }
}

export default Game;