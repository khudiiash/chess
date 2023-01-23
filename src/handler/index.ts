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
      const userID = socket.handshake.query.userID;
      let isNew = true;
      let user = this.users.find((user) => user.id === userID);

      if (user) {
        isNew = false;
        user.updateSocket(socket);
        const game = this.findGameByUser(user);
        if (game) {
          game.setEvents();
          user.socket.emit(events.joinedGame, game.joinData);
        }

      } else{
        user = new User(socket, this.users.length);
        this.users.push(user);
      }


        
      socket.on(events.disconnected, this.onDisconnected.bind(this, user));
      socket.on(events.setUserName, (name) => this.setName(socket, name));
      socket.on(events.join, (data) => this.join(data));
      if (!isNew) return;

      let game = this.createGame(user);
      socket.emit(events.gameCreated, game.id);

      socket.broadcast.emit(events.playerConnected, {
        id: socket.id,
        index: this.users.length - 1,
      });
    });
  }

  onDisconnected(user) {


  }

  findGameByUser(user: User) {
    return this.games.find((game) => user.gameID === game.id  && game.active);
  }

  join(data) {
    const { gameID, userID } = data;
    const game = this.games.find((game) => game.id === gameID);
    const joiner = this.users.find((user) => user.id === userID);

    if (!game) {
      console.log('game not found');
      joiner.socket.emit(events.gameNotFound);
      return;
    }

    if (game.active) {
      return;
    }
    
    if (!game.active) {
      joiner.setSide(game.host.side === 'white' ? 'black' : 'white');
      game.addPlayer(joiner);
    }

 
  }

  

  setName(socket: Socket, name: string) {
    const user = this.users.find((user) => user.socket.id === socket.id);
    if (!user) return;
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