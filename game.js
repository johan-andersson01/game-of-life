/*jslint browser:true */
/*jslint plusplus: true */
var canvas, cc;
var rps;
var cellSize;
var prevRound, thisRound, rows, cols, scarcity;

function initCanvas() {
    "use strict";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.round(window.innerWidth / cellSize);
    rows = Math.round(window.innerHeight / cellSize);
    prevRound = [];
    prevRound.length = cols;
    var x, y, setAlive = 0;
    for (x = 0; x < cols; x++) {
        prevRound[x] = [];
        prevRound[x].length = rows;
        for (y = 0; y < rows; y++) {
            if (x === 0 || y === 0 || x === cols - 1 || y === rows - 1 ) {
                prevRound[x][y] = 0;

            } else {
                prevRound[x][y] = Math.round(Math.random() - scarcity);
            }
        }
    }


    thisRound = [];
    thisRound.length = rows;
    for (x = 0; x < cols; x++) {
        thisRound[x] = [];
        thisRound[x].length = rows;
        for (y = 0; y < rows; y++) {
            thisRound[x][y] = 0;
        }
    }
}


function getNeighbours(x, y) {
    "use strict";
    var neighbours = [],
        i, k;
    neighbours.length = 8;
    for (i = -1; i < 2; i++) {
        for (k = -1; k < 2; k++) {
            if (!(i === 0 && k === 0)) {
                neighbours.push(prevRound[x + i][y + k]);
            }
        }
    }
    return neighbours;
}

function survival(x, y) {
    "use strict";
    var neighbours = getNeighbours(x, y),
        aliveNeighbours = 0,
        wasIalive = prevRound[x][y],
        survive = 0,
        j;
    for (j = 0; j < neighbours.length; j++) {
        if (neighbours[j] === 1) {
            aliveNeighbours++;
        }
    }

    if (wasIalive && (aliveNeighbours < 2 || aliveNeighbours > 3)) {
        survive = 0;
    } else if (wasIalive && (aliveNeighbours === 2 || aliveNeighbours === 3)) {
        survive = 1;
    } else if (!wasIalive && aliveNeighbours === 3) {
        survive = 1;
    }
    return survive;
}

function applyRules() {
    "use strict";
    var terminate = true,
        x, y;
    for (x = 0; x < cols; x++) {
        for (y = 0; y < rows; y++) {
            if (x < 2 || y < 2 || x > cols - 2 || y > rows - 2) {
                thisRound[x][y] = 0;
            } else {
                thisRound[x][y] = survival(x, y);
                if (prevRound[x][y] !== thisRound[x][y]) {
                    terminate = false;
                }
            }
            prevRound[x][y] = thisRound[x][y];
            if (thisRound[x][y] === 1) {
                cc.fillStyle = '#E84C0C';
            } else {
                cc.fillStyle = 'white';
            }
            cc.fillRect(x * cellSize, y * cellSize, (x + 1) * cellSize,
                (y + 1) * cellSize);
        }
    }
    return terminate;
}

function drawCanvas() {
    "use strict";
    cc.fillStyle = 'white';
    cc.fillRect(0, 0, canvas.width, canvas.height);
    return applyRules();
}

window.onload = function() {
    "use strict";
    canvas = document.getElementById('canvas');
    cc = canvas.getContext('2d');
    rps = window.prompt("Set rounds per second", "1");
    cellSize = window.prompt("Set cell size (px)", "10");
    scarcity = parseFloat(window.prompt("Set cell scarcity (min: 0, max: 5)", "3"))/10;
    initCanvas();
    var refresherID = setInterval(function() {
        if (drawCanvas()) {
            clearInterval(refresherID);
        }

    }, 1000 / rps);

};
