"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = __importDefault(require("./game"));
const user_1 = __importDefault(require("./user"));
const globals_1 = require("../globals");
class UserHandler {
    constructor(io) {
        this.io = io;
        this.users = [];
        this.games = [];
        this.setupConnection();
    }
    setupConnection() {
        this.io.on(globals_1.events.connection, (socket) => {
            const userID = socket.handshake.query.userID;
            let user = this.users.find((user) => user.id === userID);
            if (user) {
                console.log('user found');
                user.updateSocket(socket);
                if (user.activeGame) {
                    user.socket.emit(globals_1.events.ownGameID, user.game.id);
                    user.socket.emit(globals_1.events.joinedGame, user.activeGame.joinData);
                }
                else if (user.game) {
                    user.socket.emit(globals_1.events.ownGameID, user.game.id);
                }
            }
            else {
                user = new user_1.default(socket, this.users.length);
                this.users.push(user);
                let game = this.createGame(user);
                socket.emit(globals_1.events.ownGameID, game.id);
            }
            socket.on(globals_1.events.setUserName, (name) => this.setName(socket, name));
            socket.on(globals_1.events.join, (data) => this.join(data));
        });
    }
    join(data) {
        console.log(data);
        const { gameID, userID } = data;
        const game = this.games.find((game) => game.id === gameID);
        const joiner = this.users.find((user) => user.id === userID);
        if (!game) {
            console.log('game not found');
            joiner.socket.emit(globals_1.events.gameNotFound);
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
    setName(socket, name) {
        const user = this.users.find((user) => user.socket.id === socket.id);
        if (!user)
            return;
        user.setName(name);
        socket.broadcast.emit(globals_1.events.setUserName, { id: socket.id, name });
        console.log(`user ${user.id} set name to ${user.name}`);
    }
    createGame(host) {
        const game = new game_1.default(host);
        this.games.push(game);
        return game;
    }
}
exports.default = UserHandler;
//# sourceMappingURL=index.js.map