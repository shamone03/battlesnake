// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from './server.js';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
    console.log("INFO");

    return {
        apiversion: "1",
        author: "",       // TODO: Your Battlesnake Username
        color: "#888888", // TODO: Choose color
        head: "default",  // TODO: Choose head
        tail: "default",  // TODO: Choose tail
    };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
    console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
    console.log("GAME OVER\n");
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data

class Node {
    // g dist from start node
    // h dist from end node
    // f = g + h
    constructor(g, h) {
        this.g = g;
        this.h = h;
        this.f = g + h;
    }

}

function distance(startX, startY, endX, endY) {
    return Math.abs(endX - startX) + Math.abs(endY - startY);
}

function setStartingWeights(gameState, board) {
    for (let i = 0; i < gameState.board.food.length; i++) {
        let x = gameState.board.food[i].x;
        let y = (gameState.board.height - 1) - gameState.board.food[i].y;

        board[y][x] = new Node(distance(gameState.you.head.x, gameState.you.head.y, gameState.board.food[i].x, gameState.board.food[i].y), 0);

    }

    for (let i = 0; i < gameState.board.hazards.length; i++) {
        let x = gameState.board.hazards[i].x;
        let y = (gameState.board.height - 1) - gameState.board.hazards[i].y;

        board[y][x] = new Node(50, 50);
    }

    for (let i  = 0; i < gameState.board.snakes.length; i++) {

        for (let j = 0; j < gameState.board.snakes[i].body.length; j++) {
            let x = gameState.board.snakes[i].body[j].x;
            let y = (gameState.board.height - 1) - gameState.board.snakes[i].body[j].y;

            board[y][x] = new Node(50, 50);
        }
    }
}

function move(gameState) {

    let board = new Array(gameState.board.height).fill(new Node(-1, 0)).map(() => new Array(gameState.board.width).fill(new Node(-1, 0)));

    console.log(gameState.turn);
    setStartingWeights(gameState, board);

    for (let l = 0; l < board.length; l++) {
        for (let j = 0; j < board[l].length; j++) {
            process.stdout.write(board[l][j].f.toString() + '\t');
        }
        console.log();
    }

}

runServer({
    info: info,
    start: start,
    move: move,
    end: end
});
