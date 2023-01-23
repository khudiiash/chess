"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const globals_1 = require("../../globals");
class Game {
    constructor(host) {
        this.moves = [];
        this.id = (0, uuid_1.v4)().toUpperCase();
        this.host = host;
        this.host.setGameId(this.id);
        this.guest = null;
        this.players = [this.host, this.guest];
        this.host.socket.on(globals_1.events.move, this.onHostMove.bind(this));
        this.host.socket.on(globals_1.events.leave, this.onHostLeave.bind(this));
    }
    addPlayer(user) {
        if (this.guest)
            return;
        console.log('adding guest');
        this.guest = user;
        this.guest.socket.on(globals_1.events.move, this.onGuestMove.bind(this));
        this.guest.socket.on(globals_1.events.leave, this.onGuestLeave.bind(this));
        user.socket.emit(globals_1.events.joinedGame, this.joinData);
        this.host.socket.emit(globals_1.events.guestJoined, this.joinData);
    }
    get joinData() {
        return {
            host: { name: this.host.name, side: this.host.side },
            guest: { name: this.guest.name, side: this.guest.side },
            gameID: this.id
        };
    }
    onHostMove(move) {
        console.log('host move', move);
        this.moves.push(move);
        if (!this.guest) {
            console.error('no guest found', this.id);
            return;
        }
        ;
        this.guest.socket.emit(globals_1.events.move, move);
    }
    onGuestMove(move) {
        console.log('guest move', move);
        this.moves.push(move);
        this.host.socket.emit(globals_1.events.move, move);
    }
    onHostLeave() {
        console.log('host left');
        this.guest.socket.emit(globals_1.events.hostLeft);
    }
    onGuestLeave() {
        console.log('guest left');
        this.host.socket.emit(globals_1.events.guestLeft);
    }
}
exports.default = Game;
//# sourceMappingURL=index.js.map