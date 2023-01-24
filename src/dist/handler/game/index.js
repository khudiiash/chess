"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const globals_1 = require("../../globals");
class Game {
    constructor(host) {
        this.active = false;
        this.id = (0, uuid_1.v4)().toUpperCase();
        this.host = host;
        this.host.setGame(this);
    }
    addPlayer(guest) {
        if (this.guest)
            return;
        this.active = true;
        this.guest = guest;
        this.guest.setActiveGame(this);
        this.host.setActiveGame(this);
        this.guest.setOpponent(this.host);
        this.host.setOpponent(this.guest);
        this.setEvents();
        this.guest.socket.emit(globals_1.events.joinedGame, this.joinData);
        this.host.socket.emit(globals_1.events.guestJoined, this.joinData);
    }
    setEvents() {
        this.players.forEach(player => {
            const opponent = this.players.find(p => p !== player);
            player.socket.on(globals_1.events.move, (data) => this.move(opponent, data));
            player.socket.on(globals_1.events.leave, () => this.leave(player, opponent));
            player.socket.on(globals_1.events.restartRequest, () => opponent.socket.emit(globals_1.events.restartRequested));
            player.socket.on(globals_1.events.restartAccept, () => opponent.socket.emit(globals_1.events.restartAccepted));
            player.socket.on(globals_1.events.restartRefuse, () => opponent.socket.emit(globals_1.events.restartRefused));
        });
    }
    get events() {
        return [globals_1.events.move, globals_1.events.leave, globals_1.events.opponentLeft, globals_1.events.restartRequest, globals_1.events.restartRequested, globals_1.events.restartAccept, globals_1.events.restartAccepted, globals_1.events.restartRefuse, globals_1.events.restartRefused];
    }
    get joinData() {
        return {
            host: { name: this.host.name, side: this.host.side, id: this.host.id },
            guest: { name: this.guest.name, side: this.guest.side, id: this.guest.id },
            gameID: this.id
        };
    }
    get players() {
        return [this.host, this.guest];
    }
    move(opponent, data) {
        console.log('move', data);
        opponent.socket.emit(globals_1.events.move, data);
    }
    leave(player, opponent) {
        this.active = false;
        this.host.removeListeners(this.events);
        this.guest.removeListeners(this.events);
        player.setActiveGame(null);
        opponent.setActiveGame(null);
        opponent.socket.emit(globals_1.events.opponentLeft);
        this.guest = null;
        this.active = false;
    }
}
exports.default = Game;
//# sourceMappingURL=index.js.map