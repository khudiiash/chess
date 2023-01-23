"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(socket, index) {
        this.socket = socket;
        this.index = index;
        this.id = socket.id;
        this.side = 'white';
        this.name = `Player ${index + 1}`;
    }
    setSide(side) {
        this.side = side;
    }
    setName(name) {
        this.name = name;
    }
    setGameId(gameId) {
        this.gameId = gameId;
    }
}
exports.default = User;
//# sourceMappingURL=index.js.map