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
      let user = this.users.find((user) => user.id === userID);

      if (user) {
        console.log('user found')
        user.updateSocket(socket);
        if (user.activeGame) {
          user.socket.emit(events.ownGameID, user.game.id);
          user.socket.emit(events.joinedGame, user.activeGame.joinData);
        } else if (user.game) {
          user.socket.emit(events.ownGameID, user.game.id);
        }
      } else{
        user = new User(socket, this.users.length);
        this.users.push(user);
        let game = this.createGame(user);
        socket.emit(events.ownGameID, game.id);
      }

      socket.on(events.setUserName, (name) => this.setName(socket, name));
      socket.on(events.join, (data) => this.join(data));
    });
  }
 

  join(data: {gameID: string, userID: string, side: "white" | "black"}) {

    console.log(data)
    const { gameID, userID } = data;
    const game = this.games.find((game) => game.id === gameID);
    const joiner = this.users.find((user) => user.id === userID);

    if (!game) {
      console.log('game not found');
      joiner.socket.emit(events.gameNotFound);
      return;
    }

    if (game.host && game.guest) {
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