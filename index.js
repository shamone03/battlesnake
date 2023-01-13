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
    constructor(g, h, type) {
        this.g = g;
        this.h = h;
        this.f = g + h;
        this.type = type;
        
    }

    equals(x, y) {
        return this.x === x && this.y === y;
    }

    

}

// function distance(startX, startY, endX, endY) {
//     return Math.abs(endX - startX) + Math.abs(endY - startY);
// }

function setStartingWeights(gameState, board) {
    
    for (let i = 0; i < gameState.board.food.length; i++) {
        let x = gameState.board.food[i].x;
        let y = (gameState.board.height - 1) - gameState.board.food[i].y;

        board[y][x] = new Node(50, 50, "F");
        
    }

    for (let i = 0; i < gameState.board.hazards.length; i++) {
        let x = gameState.board.hazards[i].x;
        let y = (gameState.board.height - 1) - gameState.board.hazards[i].y;

        board[y][x] = new Node(50, 50, "H");
    }

    for (let i  = 0; i < gameState.board.snakes.length; i++) {

        for (let j = 0; j < gameState.board.snakes[i].body.length; j++) {
            let x = gameState.board.snakes[i].body[j].x;
            let y = (gameState.board.height - 1) - gameState.board.snakes[i].body[j].y;

            board[y][x] = new Node(50, 50, "S");
        }
    }
}

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

function move(gameState) {
    // choose lowest direction
    // break epsilon ties by checking other snakes/hazards
    console.log(gameState.turn)
    let hazards = [];
    

    for (let i = 0; i < gameState.board.hazards.length; i++) {
        hazards.push(new Coord(gameState.board.hazards[i].x, gameState.board.hazards[i].y));
    }

    for (let i = 0; i < gameState.board.snakes.length; i++) {
        for (let j = 0; j < gameState.board.snakes[i].body.length; j++) {
            hazards.push(new Coord(gameState.board.snakes[i].body[j].x, gameState.board.snakes[i].body[j].y));
        }
    }
    
    console.log("hazards: ");
    for (let i = 0; i < hazards.length; i++) {
        console.log(hazards[i].x + ' ' + hazards[i].y);
    }
    
    let neighbours = [
        {f: 999, coord: new Coord(gameState.you.head.x, gameState.you.head.y + 1), move: "up"},
        {f: 999, coord: new Coord(gameState.you.head.x + 1, gameState.you.head.y), move: "right"},
        {f: 999, coord: new Coord(gameState.you.head.x, gameState.you.head.y - 1), move: "down"},
        {f: 999, coord: new Coord(gameState.you.head.x - 1, gameState.you.head.y), move: "left"}
    ];
    console.log("neighbours: ");
    for (let i = 0; i < neighbours.length; i++) {
        console.log(neighbours[i].coord.x + ' ' + neighbours[i].coord.y);
    }
    // neighbours = neighbours.filter(e => e.coord.x < 0 || e.coord.x > (gameState.board.width - 1) || e.coord.y < 0 || e.coord.y > (gameState.board.height - 1));
    
    // for (let i = 0; i < hazards.length; i++) {
    //     neighbours = neighbours.filter(e => e.equals(hazards[i]));
    // }
    for (let i = 0; i < hazards.length; i++) {
        
        neighbours = neighbours.filter(e => e.coord.equals(hazards[i]));
    }
    

    let lowestNeighbour = neighbours[0];
    console.log("neighbours after filter: ");
    for (let i = 0; i < neighbours.length; i++) {
        console.log(neighbours[i].coord.x + ' ' + neighbours[i].coord.y);
    }
    
    for (let i = 0; i < neighbours.length; i++) {
        for (let j = 0; j < gameState.board.food.length; j++) {
            neighbours[i].f = Math.min(neighbours[i].f, distance(new Coord(gameState.board.food[j].x, gameState.board.food[j].y), neighbours[i].coord));
        }

        if (neighbours[i].f < lowestNeighbour.f) {
            // if (!hazards.find(e => e.equals(neighbours[i].coord))) {
            // }
            lowestNeighbour = neighbours[i];
            
        }
        
    }
    
    
    console.log(lowestNeighbour)
    
    return { move: lowestNeighbour.move };
    
}

// function move(gameState) {
//     let board = new Array(gameState.board.height).fill(new Node(50, 50, "O")).map(() => new Array(gameState.board.width).fill(new Node(50, 50, "O")));
    
//     let hazards = [];

//     setStartingWeights();
    
//     for (let i = 0; i < gameState.board.hazards.length; i++) {
//         hazards.push(board[(gameState.board.height - 1) - gameState.board.hazards[i].y][gameState.board.hazards[i].x]);
//     }
    
//     for (let i  = 0; i < gameState.board.snakes.length; i++) {
//         for (let j = 0; j < gameState.board.snakes[i].body.length; j++) {
//             hazards.push(board[(gameState.board.height - 1) - gameState.board.snakes[i].body[j].y][gameState.board.snakes[i].body[j].x]);
//         }
//     }

//     let neighbours = [{node: board[current.y + 1][current.x], x: current.x, y: current.y + 1},
//                       {node: board[current.y][current.x + 1], x: current.x + 1, y: current.y},
//                       {node: board[current.y + 1][current.x], x: current.x, y: current.y + 1},
//                       {node: board[current.y][current.x - 1], x: current.x - 1, y: current.y}];
//     let lowestF = 999;
//     let move = ["up", "right", "down", "left"];
//     for (let i = 0; i < neighbours.length; i++) {
//         if (neighbours[i].f < lowestF) {
            
//         }
//     }
    
// }

// function move(gameState) {

//     let board = new Array(gameState.board.height).fill(new Node(50, 50, "O")).map(() => new Array(gameState.board.width).fill(new Node(50, 50, "O")));
//     let open = [];
//     let closed = [];
//     let hazards = [];

//     setStartingWeights()
    
//     for (let i = 0; i < gameState.board.hazards.length; i++) {
//         hazards.push(board[(gameState.board.height - 1) - gameState.board.hazards[i].y][gameState.board.hazards[i].x]);
//     }
//     for (let i  = 0; i < gameState.board.snakes.length; i++) {
//         for (let j = 0; j < gameState.board.snakes[i].body.length; j++) {
//             hazards.push(board[(gameState.board.height - 1) - gameState.board.snakes[i].body[j].y][gameState.board.snakes[i].body[j].x]);
//         }
//     }
    
//     let closestFoodX = gameState.board.food[0].x;
//     let closestFoodY = gameState.board.food[0].y;
//     let lowestDist = distance(gameState.you.head.x, gameState.you.head.y, closestFoodX, closestFoodY);
    
//     for (let i = 0; i < gameState.board.food.length; i++) {
//         let dist = distance(gameState.you.head.x, gameState.you.head.y, gameState.board.food[i].x, gameState.board.food[i].y);
//         if (dist < lowestDist) {
//             lowestDist = dist;
//             closestFoodX = gameState.board.food[i].x;
//             closestFoodY = gameState.board.food[i].y;
            
//         }
//     }
    
//     // open.push(new Node(0, lowestDist, "S", gameState.you.head.x, gameState.you.head.y));
    
//     open.push({
//         node: board[(gameState.board.height - 1) - gameState.you.head.y][gameState.you.head.x],
//         x: gameState.you.head.x,
//         y: (gameState.board.height - 1) - gameState.you.head.y
//     });
    
//     // let board = new Array(gameState.board.height * gameState.board.width).fill(50, 50, "O", );
//     while (open.length > 0) {
//         let current = open[0];
//         for (let i = 0; i < open.length; i++) {
//             if (open[i].f < current.f) {
//                 current = open[i];
//             }
//         }

//         if (current.x === closestFoodX && current.y === closestFoodY) {
//             return;
//         }

//         let neighbours = [{node: board[current.y - 1][current.x], x: current.x, y: current.y - 1},
//                           {node: board[current.y + 1][current.x], x: current.x, y: current.y + 1},
//                           {node: board[current.y][current.x - 1], x: current.x - 1, y: current.y},
//                           {node: board[current.y][current.x - 1], x: current.x + 1, y: current.y}]
                          

//         for (let i = 0; i < neighbours.length; i++) {
//             if (hazards.find(e => e.x === neighbours[i].x && e.y === neighbours[i].y) || closed.find(e => e.x === neighbours[i].x && e.y === neighbours[i].y)) {
//                 continue;
//             }
//             let newDist = distance(current.x, current.y, neighbours[i].x, neighbours[i].y);
            
//             if (newDist < neighbours[i].node.f || !open.find(e => e.x === neighbours[i].x && e.y === neighbours[i].y)) {
//                 neighbours[i].f = newDist;
                
//             }
            
//         }
//     }
// }


runServer({
    info: info,
    start: start,
    move: move,
    end: end
});
