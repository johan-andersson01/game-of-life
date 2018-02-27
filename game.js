/* jshint esversion: 6 */
let canvas = document.getElementById("canvas");
let cc;
let cellSize;
let currentState;
let nextState;
let rows;
let cols;
let pad = 2; // padding
let ctrlDown = 0;
let firstClick = false;

const initCanvas = () => {
    "use strict";
    cc = canvas.getContext("2d");
    cellSize = 10;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.round(window.innerWidth / cellSize);
    rows = Math.round(window.innerHeight / cellSize);
    currentState = new Map();
    nextState = new Map();
    cc.font = "30px Arial";
    cc.fillText("Only tested for Firefox", canvas.width/2-canvas.width*0.2, canvas.height/2);
    cc.fillText("PC: hold ctrl and move your mouse. Press delete to clear.", canvas.width/2-canvas.width*0.2, canvas.height/2+40);
    cc.fillText("Mobile: (multi)touch! Reload to clear.", canvas.width/2-canvas.width*0.2, canvas.height/2+80);
};

const getNeighbours = (x, y) => {
    "use strict";
    let neighbours = [];
    for (let i = -1; i < 2; i++) {
        for (let k = -1; k < 2; k++) {
            if (i != 0 || k != 0) {
                neighbours.push([x + i, y + k]);
            }
        }
    }
    return neighbours;
};

const nbrOfAliveNeighbours = (x, y) => {
    "use strict";
    let alive = 0;
    for (let i = -1; i < 2; i++) {
        for (let k = -1; k < 2; k++) {
            if (i != 0 || k != 0) {
                let coord = (x + i) + '-' + (y + k);
                if (currentState.has(coord)) {
                    alive += 1;
                }
            }
        }
    }
    return alive;
};

const calcNextState = (x, y) => {
    "use strict";
    var aliveNeighbours = nbrOfAliveNeighbours(x, y);
    let coord = x + '-' + y;
    if (currentState.has(coord) && (aliveNeighbours === 2 || aliveNeighbours === 3)) {
        nextState.set(coord, 1);
    } else if (!currentState.has(coord) && aliveNeighbours === 3) {
        nextState.set(coord, 1);
    }
};

const survival = (x, y) => {
    "use strict";
    calcNextState(x, y);
    const neighbours = getNeighbours(x, y);
    for (const position of neighbours) {
        const x1 = position[0];
        const y1 = position[1];
        let coord = x1 + '-' + y1;
        if (x1 > pad && x1 < cols - pad && y1 > pad && y1 < rows - pad) {
            if (!currentState.has(coord)) {
                calcNextState(x1, y1);
            }
        }
    }
};

const run = (color) => {
    "use strict";
    if (currentState.size > 0) {
        cc.fillStyle = "white";
        cc.fillRect(0,0,canvas.width, canvas.height);
    } 
    for (const [coord, value] of currentState) {
        let coords = [];
        coords = coord.split('-');
        coords = coords.map(c => parseInt(c));
        let x = coords[0], y = coords[1];
        survival(x, y);
        cc.fillStyle = color;
        cc.fillRect(x*cellSize,y*cellSize, cellSize, cellSize);
    }
    currentState = nextState;
    nextState = new Map();
    return true;
};

window.onload = () => {
    "use strict";
    initCanvas();
    let colors = ["turquoise", "mediumturquoise", "darkturquoise"];
    let i = 0;
    let refresherID = setInterval(function() {
        if (i == colors.length) i = 0;
        let color = colors[i++];
        if (!run(color)) {
            clearInterval(refresherID);
        }
    }, 100);
};

document.addEventListener('mousemove', function(event) {
    if (!firstClick) {
        firstClick = true;
    }
    if (event.ctrlKey) {
        let x = event.pageX;
        let y = event.pageY;
        let coord = Math.round(x/cellSize) + '-' + Math.round(y/cellSize);
        nextState.set(coord, 1);
    }
}, false);

  document.addEventListener('keydown', (event) => {
    keyName = event.key;
    if (keyName === 'Delete') {
        currentState = new Map();
    }
  });

  document.addEventListener("touchmove", (event) => {
    if (!firstClick) {
        firstClick = true;
    }
    var i;
    for ( i=0; i < event.changedTouches.length; i++) {
        let x = event.changedTouches[i].pageX;
        let y = event.changedTouches[i].pageY;
        let coord = Math.round(x/cellSize) + '-' + Math.round(y/cellSize);
        nextState.set(coord, 1);
    }
  }, false);