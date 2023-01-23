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
    setName(name) {
        this.name = name;
    }
    setGameId(gameId) {
        this.gameID = gameId;
    }
    updateSocket(socket) {
        this.socket.eventNames().forEach((event) => {
            const callbacks = this.socket.listeners(event);
            callbacks.forEach((callback) => {
                socket.on(event, callback);
            });
        });
        this.socket.removeAllListeners();
        this.socket = socket;
    }
    removeListeners(names) {
        names.forEach((event) => {
            console.log('removing listener', event);
            this.socket.removeAllListeners(event);
        });
    }
}
exports.default = User;
//# sourceMappingURL=index.js.map