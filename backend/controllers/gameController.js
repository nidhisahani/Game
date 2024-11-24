const gameService= require('../services/gameHandler')

module.exports = (io, socket) => {
    // Join a game
    socket.on('joinGame', (gameId) => {
        gameService.addPlayerToGame(gameId, socket.id, (error, response) => {
            console.log('Enter')
            if (error) {
                socket.emit('error', error);
            } else {
                socket.join(gameId);
                socket.emit('playerAssigned', response.symbol);
                if (response.startGame) {
                    io.to(gameId).emit('gameStart', 'Both players have joined. Game starts now!');
                }
            }
        });
    });

    // Handle moves
    socket.on('makeMove', ({ gameId, index }) => {
        const result = gameService.handleMove(gameId, socket.id, index);
        if (result.error) {
            socket.emit('error', result.error);
        } else {
            io.to(gameId).emit('boardUpdated', result.board);
        }
    });
};