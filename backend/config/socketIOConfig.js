const gameController = require('../controllers/gameController');

// module.exports = (io) => {
//     io.on('connection', (socket) => {
//         console.log(`Player connected: ${socket.id}`);

//         // Game-related event handling
//         gameController(io, socket);

//         // Handle disconnect
//         socket.on('disconnect', () => {
//             console.log(`Player disconnected: ${socket.id}`);
//         });
//     });
// };

const configureSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`Player connected: ${socket.id}`);

        gameController(io, socket);

        // Handle Socket.IO events here
        socket.on('disconnect', () => {
            console.log(`Player disconnected: ${socket.id}`);
        });
    });
};

module.exports = (server) => {
    const { Server } = require('socket.io');
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000', // Your React app's URL
            methods: ['GET', 'POST'],       // HTTP methods you want to allow
        },
    });
    configureSocket(io);
};

