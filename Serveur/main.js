const express = require('express');
const cors = require('cors');
const port = 8080;
const session = require("express-session");
const body_parser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const ws = require('ws');
const wss = new ws.Server({ server });
const waitingPlayers = [];
const Players = require('./models/Players.js');
const playingPlayers = [];
const Waiting = require('./models/Waiting.js');
const Games = require('./models/Games.js');

app.use(cors({
    origin: '*'
}));

app.use(session({
    secret: 'your secret',
    resave: false,
    saveUninitialized: true
}));

app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());

app.set('view engine', 'ejs');

routes = require('./routeur/routeur');
app.use(routes);

app.use('/static', express.static('./static'));

wss.on('connection', async (ws) =>  {
    console.log('Client connected');
    ws.on('message', async (message) => {
        console.log('Received message: ', message);
        const info = JSON.parse(message);
        console.log(info)
        if (info.type === 'join') {
            waitingPlayers.push(info.id);
            let opponent = await getOpponent(info.id, 0);
            console.log("Opponent:", opponent);
            if (opponent) {
                ws.send(JSON.stringify({
                    type: 'start-game'
                }));
            }
        } else if (info.type === 'start') {
            ws.send(JSON.stringify({
                type: 'init'
            }));
        } else if (info.type === 'move') {
            let sign = info.symbol;
            let board = info.board;
            console.log("Board: ", board);
            board[info.row][info.col] = sign;
            console.log(board);
            console.log("New Board: ", JSON.stringify(board));
            await Games.updateGame(info.game_id, JSON.stringify(board));
            broadcast({
                type: 'move',
                board: board
            });
        } else if (info.type === 'game-over') {
            let winner = info.winner;
            let gameId = info.game_id;

            broadcast({
                type: 'move',
                board: info.board,
                winner: winner
            });

            await Games.delGame(gameId);
        }
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

broadcast = (message) => {
    wss.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

getOpponent = async (playerId, maxDiff) => {
    let isWaiting = false;
    const player = await Players.getPlayer(playerId);
    const game = await Games.getGameByPlayerId(playerId);
    if (game) {
        return true;
    }
    const minMMR = player.matchmaking_rating - maxDiff;
    const maxMMR = player.matchmaking_rating + maxDiff;
    const waitings = await Waiting.getWaitings(minMMR, maxMMR);
    waitings.forEach(waiting => {
        if (waiting.player_id == playerId) {
            isWaiting = true;
        }
    });
    if (!isWaiting) {
        await Waiting.createWaiting(player.player_id);
    }
    if (waitings.length > 1) {
        let opponentId = waitings[0].player_id;
        if (opponentId == playerId) {
            opponentId = waitings[1].player_id;
        }
        await Waiting.delWaiting(playerId);
        await Waiting.delWaiting(opponentId);
        waitingPlayers.splice(waitingPlayers.indexOf(opponentId), 1);
        waitingPlayers.splice(waitingPlayers.indexOf(playerId), 1);
        playingPlayers.push(playerId);
        playingPlayers.push(opponentId);
        await Games.createGame(playerId, opponentId);
        return true;
    } else {
        return await getOpponent(playerId, maxDiff++);
    }
}

server.listen(port, () => console.log(`localhost:${port}/`));