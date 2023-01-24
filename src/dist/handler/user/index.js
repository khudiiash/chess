"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(socket, index) {
        this.socket = socket;
        this.index = index;
        this.id = socket.handshake.query.userID;
        this.side = socket.handshake.query.side;
        this.name = `Player ${index + 1}`;
    }
    setSide(side) {
        this.side = side;
    }
    setGame(game) {
        this.game = game;
    }
    setName(name) {
        this.name = name;
    }
    setActiveGame(game) {
        this.activeGame = game;
    }
    setOpponent(opponent) {
        this.opponent = opponent;
    }
    updateSocket(socket) {
        this.socket.eventNames().forEach((event) => {
            const callbacks = this.socket.listeners(event);
            callbacks.forEach((callback) => {
                socket.on(event, callback);
            });
        });
        this.socket.disconnect();
        delete this.socket;
        this.socket = socket;
    }
    removeListeners(names) {
        names.forEach((event) => {
            this.socket.removeAllListeners(event);
        });
    }
}
exports.default = User;
//# sourceMappingURL=index.js.map