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
    // console.log(gameState.turn)
    let hazards = [];
    // create hazards array
    for (let i = 0; i < gameState.board.hazards.length; i++) {
        hazards.push(new Coord(gameState.board.hazards[i].x, gameState.board.hazards[i].y));
    }

    // body of snakes
    let otherSnakes = [];
    
    for (let i = 0; i < gameState.board.snakes.length; i++) {
        for (let j = 0; j < gameState.board.snakes[i].body.length; j++) {
            hazards.push(new Coord(gameState.board.snakes[i].body[j].x, gameState.board.snakes[i].body[j].y));
            if (gameState.board.snakes[i].id !== gameState.you.id) {
                otherSnakes.push(new Coord(gameState.board.snakes[i].body[j].x, gameState.board.snakes[i].body[j].y));
            }
        }
    }
    
    

    if (gameState.you.length >= satisfiedLen) {
        snakeState = 1;
        if (gameState.you.health < 50) {
            snakeState = 0;
        }
    } else {
        snakeState = 0;
    }
    let neighbours = [
        {snakeWeight: 999, f: 999, coord: new Coord(gameState.you.head.x, gameState.you.head.y + 1), move: "up"},
        {snakeWeight: 999, f: 999, coord: new Coord(gameState.you.head.x + 1, gameState.you.head.y), move: "right"},
        {snakeWeight: 999, f: 999, coord: new Coord(gameState.you.head.x, gameState.you.head.y - 1), move: "down"},
        {snakeWeight: 999, f: 999, coord: new Coord(gameState.you.head.x - 1, gameState.you.head.y), move: "left"}
    ];
    
    // remove invalid neighbours 
    neighbours = neighbours.filter(e => !(e.coord.x < 0 || e.coord.x > (gameState.board.width - 1) || e.coord.y < 0 || e.coord.y > (gameState.board.height - 1)));
    neighbours = neighbours.filter(e => !hazards.find(h => h.equals(e.coord)));
    
    let bestNeighbour = neighbours[0];
    // console.log(snakeStates[snakeState]);
    
    // choose lowest neighbour
    // if hunger
    if (snakeStates[snakeState] === "Hunger") {
        
        for (let i = 0; i < neighbours.length; i++) {
            for (let j = 0; j < gameState.board.food.length; j++) {
                neighbours[i].f = Math.min(neighbours[i].f, distance(new Coord(gameState.board.food[j].x, gameState.board.food[j].y), neighbours[i].coord));
            }
            
            if (neighbours[i].f < bestNeighbour.f) {
                bestNeighbour = neighbours[i];
            }
        }   
    
    }

    // current objective: survive
    if (snakeStates[snakeState] === "Survive") {

        for (let i = 0; i < neighbours.length; i++) {
            for (let s = 0; s < gameState.board.snakes.length; s++) {
                for (let b = 0; b < gameState.board.snakes[s].body.length; b++) {
                    if (gameState.board.snakes[s].id !== gameState.you.id) {
                        let curWeight = distance(new Coord(gameState.board.snakes[s].body[b].x, gameState.board.snakes[s].body[b].y), neighbours[i].coord);
                        // console.log(`neighbours[i]: ${neighbours[i].snakeWeight}, curWeight: ${curWeight}`);
                        neighbours[i].snakeWeight = Math.min(neighbours[i].snakeWeight, curWeight);    
                    }
                    
                    
                }
            }

            if (neighbours[i].snakeWeight > bestNeighbour.snakeWeight) {
                bestNeighbour = neighbours[i];
            }
            
        }
        
    }
    
    
    // console.log(bestNeighbour);
    
    return { move: bestNeighbour.move };
    
}



runServer({
    info: info,
    start: start,
    move: move,
    end: end
});
