const { Server } = require('socket.io');
const { handleJoinGame, handleMove, handleDisconnect } = require('../services/gameHandler');

const configureSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000', // React frontend
            methods: ['GET', 'POST'],
        },
    });

    const games = {}; // Store game states

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('joinGame', (gameId) => handleJoinGame(socket, io, gameId, games));
        socket.on('makeMove', (data) => handleMove(socket, io, data, games));
        socket.on('disconnect', () => handleDisconnect(socket, io, games));
    });

    return io;
};

module.exports = configureSocket;
