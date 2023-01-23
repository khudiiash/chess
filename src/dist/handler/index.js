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
            const user = new user_1.default(socket, this.users.length);
            console.log('user connected', user.id);
            this.users.push(user);
            let game = this.createGame(user);
            socket.emit(globals_1.events.gameCreated, game.id);
            socket.on(globals_1.events.disconnected, this.onDisconnected.bind(this, user));
            socket.on(globals_1.events.setUserName, (name) => this.setName(socket, name));
            socket.on(globals_1.events.join, (data) => this.join(data));
            socket.broadcast.emit(globals_1.events.playerConnected, {
                id: socket.id,
                index: this.users.length - 1,
            });
        });
    }
    onDisconnected(user) {
        const socket = user.socket;
        this.users = this.users.filter((user) => user.id !== socket.id);
        const game = this.findGameByUser(user);
        if (!game)
            return;
        if (game.host.id === user.id && game.guest) {
            game.guest.socket.emit(globals_1.events.hostLeft);
            game.guest.socket.disconnect();
            game.host = game.guest;
            game.guest = null;
        }
        else {
            game.host.socket.emit(globals_1.events.guestLeft);
            game.host.socket.disconnect();
            game.guest = null;
        }
    }
    findUserBySocket(socket) {
        // TODO: find user by socket
    }
    findGameByUser(user) {
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
            guest.socket.emit(globals_1.events.gameNotFound);
            return;
        }
        game.addPlayer(guest);
    }
    setName(socket, name) {
        const user = this.users.find((user) => user.id === socket.id);
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