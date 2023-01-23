import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import http from 'http';
import UserHandler from './handler';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);
new UserHandler(io);

app.use(express.static(path.join(__dirname, 'client', 'dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

const run = async() => {
    if (process.env.NODE_ENV === 'production') {
        // @ts-ignore
        const port = `0.0.0.0:${process.env.PORT}`;
        server.listen(port, () => {
            console.log(`Production server is up on port ${port}`);
        });
    } else {
        const ngrok = require('ngrok');
        const port = 3000;
        const url = await ngrok.connect(port);
        server.listen(port, () => {
            console.log(`Development server is up on port ${port} and ngrok url is ${url}`);
        });
    }
}

run();


    







