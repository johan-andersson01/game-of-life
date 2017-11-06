"use strict";
let canvas, cc;
let cellSize;
let aliveCells, currentState, nextState, rows, cols;
let pad = 2; // padding

const initCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.round(window.innerWidth / cellSize);
    rows = Math.round(window.innerHeight / cellSize);
    currentState = [];
    currentState.length = cols;
    aliveCells = [];
    let x, y;
    for (x = 0; x < cols; x++) {
        currentState[x] = [];
        currentState[x].length = rows;
        for (y = 0; y < rows; y++) {
            if (x <= pad || y <= pad || x >= cols - pad || y >= rows - pad ) {
                currentState[x][y] = 0;

            } else {
                currentState[x][y] = Math.round(Math.random() - 0.3);
                if (currentState[x][y] === 1) {
                    aliveCells.push([x, y]);
                }
            }
        }
    }
    console.log(aliveCells.length);
    console.log(cols*rows);

    nextState = [];
    nextState.length = rows;
    for (x = 0; x < cols; x++) {
        nextState[x] = [];
        nextState[x].length = rows;
        for (y = 0; y < rows; y++) {
            nextState[x][y] = currentState[x][y];
        }
    }
}

const getNeighbours = (x, y) => {
    let neighbours = [];
    for (let i = -1; i < 2; i++) {
        for (let k = -1; k < 2; k++) {
            if (i != 0 || k != 0) {
                neighbours.push([x + i, y + k]);
            }
        }
    }
    return neighbours;
}

const nbrOfAliveNeighbours = (x, y) => {
    let alive = 0;
    for (let i = -1; i < 2; i++) {
        for (let k = -1; k < 2; k++) {
            if (i != 0 || k != 0) {
                if (currentState[x + i][y + k] === 1) {
                    alive += 1;
                }
            }
        }
    }   
    return alive;
}

const calcNextState = (x, y) => {
    var aliveNeighbours = nbrOfAliveNeighbours(x, y);
    if (currentState[x][y] === 1 && (aliveNeighbours < 2 || aliveNeighbours > 3)) {
        nextState[x][y] = 0;
    } else if (currentState[x][y] === 1 && (aliveNeighbours === 2 || aliveNeighbours === 3)) {
        nextState[x][y] = 1;
    } else if (currentState[x][y] === 0 && aliveNeighbours === 3) {
        nextState[x][y] = 1;
    }
}

const survival = (x, y) => {
    calcNextState(x, y);
    const neighbours = getNeighbours(x, y);
    for (const position of neighbours) {
        const x1 = position[0];
        const y1 = position[1];
        if (x1 > pad && x1 < cols - pad && y1 > pad && y1 < rows - pad) {
            if (currentState[x1][y1] === 0) {
                calcNextState(x1, y1);
            }
        }
    }
}

const nextRound = () => {
    // console.log(aliveCells.length);
    for (const position of aliveCells) {
        survival(position[0], position[1]);
    }
    aliveCells = [];
    let noProgress = true;
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            if (currentState[x][y] != nextState[x][y]) {
                noProgress = false;
                currentState[x][y] = nextState[x][y];
            }
            if (currentState[x][y] === 1) {
                cc.fillStyle = 'green';
                aliveCells.push([x,y]);
            }
            else {
                cc.fillStyle = 'black';
            }
            cc.fillRect(x * cellSize, y * cellSize, (x + 1) * cellSize, (y + 1) * cellSize);
        }
    }

    if (noProgress) {
        console.log("terminate");
        return false;
    }
    return true;
}

window.onload = function() {
    canvas = document.getElementById('canvas');
    cc = canvas.getContext('2d');
    cellSize = 15;
    initCanvas();
    var refresherID = setInterval(function() {
        if (!nextRound()) {
            clearInterval(refresherID);
        }

    }, 500);
};
