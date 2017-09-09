/*jslint browser:true */
/*jslint plusplus: true */
var canvas, cc;
var fps = 5;
var cellSize = 8;
var prevRound, thisRound, rows, cols;
var terminate;

function initCanvas() {
    "use strict";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.round(window.innerWidth / cellSize);
    rows = Math.round(window.innerHeight / cellSize);
    prevRound = [];
    prevRound.length = cols;
    var i, k;
    for (i = 0; i < cols; i++) {
        prevRound[i] = [];
        prevRound[i].length = rows;
        for (k = 0; k < rows; k++) {
            if (k === 0 || i === 0 || k === rows - 1 || i === cols - 1) {
                prevRound[i][k] = 0;
            } else {
                prevRound[i][k] = Math.round(Math.random());
            }
        }
    }

    thisRound = [];
    thisRound.length = rows;
    for (i = 0; i < cols; i++) {
        thisRound[i] = [];
        thisRound[i].length = rows;
        for (k = 0; k < rows; k++) {
            thisRound[i][k] = 0;
        }
    }
}

function survival(i, k) {
    "use strict";
    var neighbours = [prevRound[i - 1][k - 1], prevRound[i - 1][k],
            prevRound[i - 1][k + 1], prevRound[i][k - 1],
            prevRound[i][k + 1], prevRound[i + 1][k - 1],
            prevRound[i + 1][k], prevRound[i - 1][k + 1]
            ],
        aliveNeighbours = 0,
        wasIalive = prevRound[i][k],
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
    terminate = true;
    var i, k;
    for (i = 1; i < cols - 1; i++) {
        for (k = 1; k < rows - 1; k++) {
            thisRound[i][k] = survival(i, k);
            if (prevRound[i][k] !== thisRound[i][k]) {
                terminate = false;
            }
            prevRound[i][k] = thisRound[i][k];
            if (thisRound[i][k] === 1) {
                cc.fillStyle = '#E84C0C';
            } else {
                cc.fillStyle = '#098075';
            }
            cc.fillRect(i * cellSize, k * cellSize, i * cellSize + cellSize,
                k * cellSize + cellSize);
        }
    }
    return terminate;
}

function drawCanvas() {
    "use strict";
    cc.fillStyle = '#098075';
    cc.fillRect(0, 0, canvas.width, canvas.height);
    return applyRules();
}

window.onload = function () {
    "use strict";
    canvas = document.getElementById('canvas');
    cc = canvas.getContext('2d');
    initCanvas();
    var refresherID = setInterval(function () {
        if (drawCanvas()) {
            clearInterval(refresherID);
            cc.fillStyle = 'white';
            cc.font = "80px Arial";
            cc.fillText("LIFE IS STABLE", canvas.width/3, canvas.height/1.1);

        }

    }, 1000 / fps);

};
