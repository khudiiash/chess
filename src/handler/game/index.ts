import { v4 as uuidv4 } from 'uuid';
import { Move } from '../../types';
import User from '../user';
import { events } from '../../globals';


class Game {
  
  id: string;
  host: User;
  guest: User;
  active: boolean = false;

  constructor(host: User) {
    this.id = uuidv4().toUpperCase();
    this.host = host;
    this.host.setGame(this);
  }

  addPlayer(guest: User) {
    if (this.guest) return;
    this.active = true;
    this.guest = guest;

    this.guest.setActiveGame(this);
    this.host.setActiveGame(this);

    this.guest.setOpponent(this.host);
    this.host.setOpponent(this.guest);

    this.setEvents();
    this.guest.socket.emit(events.joinedGame, this.joinData);
    this.host.socket.emit(events.guestJoined, this.joinData);
  }

  setEvents() {
    this.players.forEach(player => {
      const opponent = this.players.find(p => p !== player);
      player.socket.on(events.move,           (data) => this.move(opponent, data));
      player.socket.on(events.leave,          () =>     this.leave(player, opponent));
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

  move(opponent: User, data: any) {
    console.log('move', data)
    opponent.socket.emit(events.move, data);
  }
  
  leave(player: User, opponent: User) {
    this.active = false;
    this.host.removeListeners(this.events);
    this.guest.removeListeners(this.events);

    player.setActiveGame(null);
    opponent.setActiveGame(null);
    opponent.socket.emit(events.opponentLeft);
    this.guest = null;
    this.active = false;
  }
}

export default Game;