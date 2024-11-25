import './App.css';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', {
    transports: ['websocket', 'polling'], 
    withCredentials: true,               
});
function App() {
  const [gameId, setGameId] = useState('');
    const [playerSymbol, setPlayerSymbol] = useState(null);
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentTurn, setCurrentTurn] = useState('O');
    const [message, setMessage] = useState('');

    // Handle Socket.IO events
    useEffect(() => {
        socket.on('playerAssigned', (symbol) => {
            setPlayerSymbol(symbol);
            setMessage(`You are Player ${symbol}`);
        });

        socket.on('gameStart', (msg) => {
            setMessage(msg);
        });

        socket.on('boardUpdated', ({ board }) => {
            setBoard(board);
        });

        socket.on('gameOver', (msg) => {
            setMessage(msg);
        });

        socket.on('playerDisconnected', (msg) => {
            setMessage(msg);
        });

        return () => {
            socket.off('playerAssigned');
            socket.off('gameStart');
            socket.off('boardUpdated');
            socket.off('gameOver');
            socket.off('playerDisconnected');
        };
    }, []);

    // Join Game
    const joinGame = () => {
        if (!gameId) {
            alert('Please enter a Game ID');
            return;
        }
        socket.emit('joinGame', gameId);
    };

    // Make a Move
    const makeMove = (index) => {
        if (board[index] || playerSymbol !== currentTurn) {
            setMessage('Not your turn or invalid move!');
            return;
        }
        socket.emit('makeMove', { gameId, index });
        setMessage('');
    };

    return (
        <div className="App">
            <h1>Two-Player Game</h1>

            {!playerSymbol && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter Game ID"
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                    />
                    <button onClick={joinGame}>Join Game</button>
                </div>
            )}

            {playerSymbol && (
                <>
                    <p>{message}</p>
                    <div className="board">
                        {board.map((cell, index) => (
                            <div
                                key={index}
                                className="cell"
                                onClick={() => makeMove(index)}
                            >
                                {cell}
                            </div>
                        ))}
                    </div>
                    <p>Current Turn: {currentTurn}</p>
                </>
            )}
        </div>
    );
}

export default App;
