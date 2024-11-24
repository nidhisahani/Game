const games=new Map();

const addPlayer=(gameId , playerId, callbackFun)=>{
    if(!games.has(gameId)){
        games.set(gameId, {players:[],board:Array(9).fill(null),currentTurn:'X'});
    }

    const game=games.get(gameId);

    if(game.players.length >=2){
        return callbackFun("Game room is full.");
    }

    const notation=game.players.length === 0 ?'X':'O';
    game.players.push(gameId);

    const startGame=game.players.length === 2;
    callbackFun(null,{notation,startGame});
}

const handleMove = (gameId, playerId, index) => {
    const game = games.get(gameId);
    if (!game) return { error: 'Game not found.' };

    const { board, currentTurn, players } = game;
    if (playerId !== players[currentTurn === 'O' ? 0 : 1]) {
        return { error: 'It is not your turn.' };
    }

    if (board[index]) {
        return { error: 'Cell already occupied.' };
    }

    board[index] = currentTurn;
    game.currentTurn = currentTurn === 'O' ? 'X' : 'O';

    return { board };
};

module.exports = { addPlayer, handleMove };