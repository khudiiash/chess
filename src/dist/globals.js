"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.START_FEN = exports.events = void 0;
var events;
(function (events) {
    // game (client)
    events["loaded"] = "loaded";
    events["move"] = "move";
    events["start"] = "start";
    events["restart"] = "restart";
    events["restore"] = "restore";
    events["difficulty"] = "difficulty";
    events["mode"] = "mode";
    events["continue"] = "continue";
    events["select"] = "select";
    events["turn"] = "turn";
    events["check"] = "check";
    events["checkmate"] = "checkmate";
    //game (server)
    events["hostLeft"] = "host left";
    events["guestLeft"] = "guest left";
    events["joinedGame"] = "joined game";
    events["guestJoined"] = "guest joined";
    events["ownGameID"] = "own game id";
    events["activeGameID"] = "active game id";
    events["gameNotFound"] = "game not found";
    // socket (server)
    events["connection"] = "connection";
    events["connected"] = "connected";
    events["disconnected"] = "disconnected";
    events["playerConnected"] = "player connected";
    events["playerDisconnected"] = "player disconnected";
    // online
    events["find"] = "find";
    events["join"] = "join";
    events["invite"] = "invite";
    events["leave"] = "leave";
    events["opponentLeft"] = "opponent left";
    events["gameID"] = "game-id";
    events["restartRequest"] = "restart request";
    events["restartRequested"] = "restart requested";
    events["restartRefuse"] = "restart refuse";
    events["restartAccept"] = "restart accept";
    events["restartRefused"] = "restart refused";
    events["restartAccepted"] = "restart accepted";
    // user
    events["setUserName"] = "name";
    events["setUserSide"] = "side";
    // ui
    events["pause"] = "pause";
    events["resume"] = "resume";
    events["goto"] = "goto";
    events["back"] = "back";
    events["exit"] = "exit";
})(events = exports.events || (exports.events = {}));
exports.START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
//# sourceMappingURL=globals.js.map