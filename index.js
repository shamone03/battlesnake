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

function distance(a, b) {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
}

class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(coord) {
        return this.x === coord.x && this.y === coord.y;
    }
}
// https://docs.battlesnake.com/api/example-move
function move(gameState) {
    let snakeStates = ["Hunger", "Survive"];
    let snakeState = 0;
    let satisfiedLen = 4;
    
    // choose lowest direction
    console.log(gameState.turn)
    let hazards = [];
    // create hazards array
    for (let i = 0; i < gameState.board.hazards.length; i++) {
        hazards.push(new Coord(gameState.board.hazards[i].x, gameState.board.hazards[i].y));
    }

    
    for (let i = 0; i < gameState.board.snakes.length; i++) {
        for (let j = 0; j < gameState.board.snakes[i].body.length; j++) {
            hazards.push(new Coord(gameState.board.snakes[i].body[j].x, gameState.board.snakes[i].body[j].y));
        }
    }


    if (gameState.you.length >= satisfiedLen) {
        snakeState = 1;
        if (gameState.you.health < 40) {
            snakeState = 0;
        }
    } else {
        snakeState = 0;
    }
    
    let possibleMoves = [
        {snakeDist: 999, snakePercent: 1, f: 999, combinedSurvive: 999,combinedHunger: 999, coord: new Coord(gameState.you.head.x, gameState.you.head.y + 1), move: "up"},
        {snakeDist: 999, snakePercent: 1, f: 999, combinedSurvive: 999,combinedHunger: 999, coord: new Coord(gameState.you.head.x + 1, gameState.you.head.y), move: "right"},
        {snakeDist: 999, snakePercent: 1, f: 999, combinedSurvive: 999,combinedHunger: 999, coord: new Coord(gameState.you.head.x, gameState.you.head.y - 1), move: "down"},
        {snakeDist: 999, snakePercent: 1, f: 999, combinedSurvive: 999,combinedHunger: 999, coord: new Coord(gameState.you.head.x - 1, gameState.you.head.y), move: "left"}
    ];
    
    // remove invalid possibleMoves
    possibleMoves = possibleMoves.filter(e => !(e.coord.x < 0 || e.coord.x > (gameState.board.width - 1) || e.coord.y < 0 || e.coord.y > (gameState.board.height - 1)));
    possibleMoves = possibleMoves.filter(e => !hazards.find(h => h.equals(e.coord)));



    let up = 0;
    let right = 0;
    let down = 0;
    let left = 0;
    
    let upSize = ((gameState.board.height - 1) - gameState.you.head.y) * (gameState.board.width);
    let rightSize = ((gameState.board.width - 1) - gameState.you.head.x) * (gameState.board.height);
    let downSize = (gameState.you.head.y) * (gameState.board.width);
    let leftSize = (gameState.you.head.x) * (gameState.board.height);
    
    
    for (let i = 0; i < hazards.length; i++) {
        if (hazards[i].y > gameState.you.head.y) {
            up++;
        }
        if (hazards[i].x > gameState.you.head.x) {
            right++;
        }
        if (hazards[i].y < gameState.you.head.y) {
            down++;
        }
        if (hazards[i].x < gameState.you.head.x) {
            left++;
        }
    }
    
    let upPercent = (upSize > 0) ? (up / upSize) : 999;
    let rightPercent = (rightSize > 0) ? (right / rightSize) : 999;
    let downPercent = (downSize > 0) ? (down / downSize) : 999;
    let leftPercent = (leftSize > 0) ? (left / leftSize) : 999;

    for (let i = 0; i < possibleMoves.length; i++) {
        if (possibleMoves[i].move === "up") {
            possibleMoves[i].snakePercent = upPercent;
        }
        if (possibleMoves[i].move === "right") {
            possibleMoves[i].snakePercent = rightPercent;
        }
        if (possibleMoves[i].move === "down") {
            possibleMoves[i].snakePercent = downPercent;
        }
        if (possibleMoves[i].move === "left") {
            possibleMoves[i].snakePercent = leftPercent;
        }
    }

    for (let i = 0; i < possibleMoves.length; i++) {
        for (let s = 0; s < gameState.board.snakes.length; s++) {
            for (let b = 0; b < gameState.board.snakes[s].body.length; b++) {
                if (gameState.board.snakes[s].id !== gameState.you.id) {
                    let curDist = distance(new Coord(gameState.board.snakes[s].body[b].x, gameState.board.snakes[s].body[b].y), possibleMoves[i].coord);
                    // console.log(`possibleMoves[i]: ${possibleMoves[i].snakeWeight}, curDist: ${curDist}`);
                    possibleMoves[i].snakeDist = Math.min(possibleMoves[i].snakeDist, curDist);
                }


            }
        }
    }

    for (let i = 0; i < possibleMoves.length; i++) {
        possibleMoves[i].combinedSurvive = (possibleMoves[i].snakePercent * (gameState.board.height + gameState.board.width)) - possibleMoves[i].snakeDist;
    }

    for (let i = 0; i < possibleMoves.length; i++) {
        for (let j = 0; j < gameState.board.food.length; j++) {
            possibleMoves[i].f = Math.min(distance(new Coord(gameState.board.food[j].x, gameState.board.food[j].y), possibleMoves[i].coord));
        }
    }

    let bestMove = possibleMoves[0];
    // console.log(snakeStates[snakeState]);
    
    // choose lowest neighbour
    // if hunger
    if (snakeStates[snakeState] === "Hunger") {

        for (let i = 0; i < possibleMoves.length; i++) {
            for (let j = 0; j < gameState.board.food.length; j++) {
                possibleMoves[i].combinedHunger = Math.min(possibleMoves[i].f, distance(new Coord(gameState.board.food[j].x, gameState.board.food[j].y), possibleMoves[i].coord)) + possibleMoves[i].snakePercent * 22;
            }

            if (possibleMoves[i].combinedHunger < bestMove.combinedHunger) {
                bestMove = possibleMoves[i];
            }
        }
    
    }

    // current objective: survive
    if (snakeStates[snakeState] === "Survive") {
        // minimize snakePercent maximize snakeDist


        for (let i = 0; i < possibleMoves.length; i++) {
            if (bestMove.combinedSurvive > possibleMoves[i].combinedSurvive) {
                bestMove = possibleMoves[i];
            }

        }
        
    }
    
    for (let i = 0; i < possibleMoves.length; i++) {
        process.stdout.write(`${possibleMoves[i].move}: ${possibleMoves[i].combinedSurvive}`);
    }
    console.log();
    
    console.log(bestMove);
    
    return { move: bestMove.move };
    
    
}



runServer({
    info: info,
    start: start,
    move: move,
    end: end
});
