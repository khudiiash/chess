import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import UserHandler from './handler';
import cors from 'cors';
import path from 'path';
import ngrok from 'ngrok';

async function main() {
    const app = express();
    const port = process.env.PORT || 3000;
    const url = await ngrok.connect({ addr: port, authtoken: '2K8CABCzjWHJJoVyyKqzUpZnY0F_4HUKoEsPLWSdLsAS32WK5' });
    app.use(cors());


    const server = http.createServer(app);
    const io = new Server(server);

    const handler = new UserHandler(io);
    app.use(express.static( path.join(__dirname, '../client/dist') ))

    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    })

    server.listen(port, () => console.log(`Server running on port ${port} and url ${url}`));
}

main();



