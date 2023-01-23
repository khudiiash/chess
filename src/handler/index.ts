import { Socket } from 'socket.io';
import Game from './game';
import User from './user';
import { events } from '../globals';

class UserHandler {
  io: any;
  users: any;
  games: Game[];
  
  constructor(io) {
    this.io = io;
    this.users = [];
    this.games = [];
    this.setupConnection();
  }

  setupConnection() {
    this.io.on(events.connection, (socket: Socket) => {
      const user = new User(socket, this.users.length);
      console.log('user connected', user.id)
      this.users.push(user);
      let game = this.createGame(user);

      socket.emit(events.gameCreated, game.id);
      
      socket.on(events.disconnected, this.onDisconnected.bind(this, user));
      socket.on(events.setUserName, (name) => this.setName(socket, name));
      socket.on(events.join, (data) => this.join(data));

      socket.broadcast.emit(events.playerConnected, {
        id: socket.id,
        index: this.users.length - 1,
      });
    });
  }

  onDisconnected(user) {
    const socket = user.socket;
    this.users = this.users.filter((user) => user.id !== socket.id);
    const game = this.findGameByUser(user);
    
    if (!game) return;
    
    if (game.host.id === user.id && game.guest) {
      game.guest.socket.emit(events.hostLeft);
      game.guest.socket.disconnect();
      game.host = game.guest;
      game.guest = null;
    } else {
      game.host.socket.emit(events.guestLeft);
      game.host.socket.disconnect();
      game.guest = null;
    }
  }

  findUserBySocket(socket) {
   // TODO: find user by socket
  }

  findGameByUser(user: User) {
    // TODO: find game by user
    return this.games.find((game) => game.id === user.gameId);
  }

  join(data) {
    const { gameId, userId } = data;
    const game = this.games.find((game) => game.id === gameId);
    const guest = this.users.find((user) => user.id === userId);

    guest.setSide('black');
    if (!game) {
      console.log('game not found');
      guest.socket.emit(events.gameNotFound);
      return;
    }
    game.addPlayer(guest);
  }

  

  setName(socket: Socket, name: string) {
    const user = this.users.find((user) => user.id === socket.id);
    user.setName(name);
    socket.broadcast.emit(events.setUserName, { id: socket.id, name });

    console.log(`user ${user.id} set name to ${user.name}`)
  }

  createGame(host) {
    const game = new Game(host);
    this.games.push(game);
    return game;
  }

}

export default UserHandler;