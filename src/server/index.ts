import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import http from 'http';
import UserHandler from './handler';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'client',  'dist')));

const server = http.createServer(app);
const io = new Server(server);
new UserHandler(io);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});




