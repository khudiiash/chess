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
            let isNew = true;
            let user = this.users.find((user) => user.id === userID);
            if (user) {
                isNew = false;
                user.updateSocket(socket);
                const game = this.findGameByUser(user);
                if (game) {
                    game.setEvents();
                    user.socket.emit(globals_1.events.joinedGame, game.joinData);
                }
            }
            else {
                user = new user_1.default(socket, this.users.length);
                this.users.push(user);
            }
            socket.on(globals_1.events.disconnected, this.onDisconnected.bind(this, user));
            socket.on(globals_1.events.setUserName, (name) => this.setName(socket, name));
            socket.on(globals_1.events.join, (data) => this.join(data));
            if (!isNew)
                return;
            let game = this.createGame(user);
            socket.emit(globals_1.events.gameCreated, game.id);
            socket.broadcast.emit(globals_1.events.playerConnected, {
                id: socket.id,
                index: this.users.length - 1,
            });
        });
    }
    onDisconnected(user) {
    }
    findGameByUser(user) {
        return this.games.find((game) => user.gameID === game.id && game.active);
    }
    join(data) {
        const { gameID, userID } = data;
        const game = this.games.find((game) => game.id === gameID);
        const joiner = this.users.find((user) => user.id === userID);
        if (!game) {
            console.log('game not found');
            joiner.socket.emit(globals_1.events.gameNotFound);
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