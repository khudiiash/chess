"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const handler_1 = __importDefault(require("./handler"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
new handler_1.default(io);
app.use(express_1.default.static(path_1.default.join(__dirname, 'client', 'dist')));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'client', 'dist', 'index.html'));
});
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.NODE_ENV === 'production') {
        server.listen(port, () => {
            console.log(`Production server is up on port ${port}`);
        });
    }
    else {
        const ngrok = require('ngrok');
        const url = yield ngrok.connect(port);
        server.listen(port, () => {
            console.log(`Development server is up on port ${port} and ngrok url is ${url}`);
        });
    }
});
run();
//# sourceMappingURL=index.js.map