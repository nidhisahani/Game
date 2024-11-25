const { checkWin } = require('../utils/gameUtils');

const handleJoinGame = (socket, io, gameId, games) => {
    console.log('enter')
    if (!games[gameId]) {
        games[gameId] = { players: [], board: Array(9).fill(null), currentTurn: 'O' };
    }

    const game = games[gameId];
    if (game.players.length < 2) {
        game.players.push(socket.id);
        socket.join(gameId);
        socket.emit('playerAssigned', game.players.length === 1 ? 'O' : 'X');
        console.log(`Player ${socket.id} joined game ${gameId} as ${game.players.length === 1 ? 'O' : 'X'}`);

        if (game.players.length === 2) {
            io.to(gameId).emit('gameStart', 'Game has started. Player O goes first.');
        }
    } else {
        socket.emit('gameFull', 'This game already has two players.');
    }
};

const handleMove = (socket, io, { gameId, index }, games) => {
    const game = games[gameId];
    if (!game || !game.players.includes(socket.id)) return;

    const playerSymbol = game.players[0] === socket.id ? 'O' : 'X';
    if (game.currentTurn !== playerSymbol) {
        socket.emit('notYourTurn', 'It is not your turn!');
        return;
    }

    if (game.board[index]) {
        socket.emit('invalidMove', 'This cell is already occupied!');
        return;
    }

    game.board[index] = playerSymbol;
    game.currentTurn = game.currentTurn === 'O' ? 'X' : 'O';

    io.to(gameId).emit('boardUpdated', { board: game.board });

    if (checkWin(game.board)) {
        io.to(gameId).emit('gameOver', `${playerSymbol} wins!`);
        delete games[gameId];
    } else if (!game.board.includes(null)) {
        io.to(gameId).emit('gameOver', 'It\'s a draw!');
        delete games[gameId];
    }
};

const handleDisconnect = (socket, io, games) => {
    console.log('User disconnected:', socket.id);
    for (const gameId in games) {
        const game = games[gameId];
        if (game.players.includes(socket.id)) {
            io.to(gameId).emit('playerDisconnected', 'A player has disconnected. Game is over.');
            delete games[gameId];
            break;
        }
    }
};

module.exports = { handleJoinGame, handleMove, handleDisconnect };
