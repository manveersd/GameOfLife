const canvas = document.getElementById("canvas");
const clearButton = document.getElementById('clearButton');
const context = canvas.getContext('2d');
const generation = 0;
const population = 0;
const width = canvas.width;
const height = canvas.height;
let res = 50;
let cellsArray = [];
let isDragging = false;
let dragStarted = false;

//sets properties of the canvas and buttons
function setup() {
    context.fillStyle = "black"
    context.fillRect(0,0,width,height);
    context.strokeStyle='white';
    context.lineWidth=1;
    startButton.addEventListener('click', startGame);

    makeGrid();
    mouseControls();
}

//makes new cells and draw them onto canvas
function makeGrid() {
    for(let row=0; row<width/res; row++) {
        cellsArray[row] = [];
        for(let col=0; col<height/res; col++) {
            cellsArray[row][col] = 0;
        }
    }

    for(let row = 0; row < width/res; row++) {
        for(let col = 0; col < height/res; col++) {
            let newCell = new Cell(row*res, col*res);
            newCell.draw();
            cellsArray[row][col] = newCell;
        }
    }
}

//draw cells using mouse click or drag
function mouseControls() {

    canvas.addEventListener('mousedown', function(event) {
        isDragging = true;
        dragStarted = false;
      });

    canvas.addEventListener('mousemove', function(event) {
        if(isDragging) {
            dragStarted = true;
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;
            let affectedCell = cellsArray[Math.floor(clickX/res)][Math.floor(clickY/res)];
            affectedCell.born();
            //affectedCell.countNeighbours();
        }
    });

    canvas.addEventListener('mouseup', function(event) {
        isDragging = false;
    });

    canvas.addEventListener('mouseleave', function(event) {
        isDragging = false;
    });

    canvas.addEventListener('click', function(event) {
        if(!dragStarted) {
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;
            let affectedCell = cellsArray[Math.floor(clickX/res)][Math.floor(clickY/res)];
            if(affectedCell.isAlive) {affectedCell.kill()}
            else{affectedCell.born()};
            affectedCell.countNeighbours();
        }
    })
}

//updates the res
function getRes(num) {
    if(num > 0) {
        res = num;
        setup();
    }
}

//resets canvas
function clearCanvas() {
    for(let row=0; row<cellsArray.length; row++) {
        for(let col=0; col<cellsArray[row].length; col++) {
            cellsArray[row][col].kill();
        }
    }
}

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.row = this.y/res;
        this.col = this.x/res;
        this.neighbours = 0;
        this.isAlive = false;
        this.countNeighbours = this.countNeighbours.bind(this);
        this.kill = this.kill.bind(this);
        this.born = this.born.bind(this);
    }

    draw() {
        context.beginPath();
        context.rect(this.x, this.y, res, res);
        context.stroke();
    }

    countNeighbours() {
        let num = 0;
        let opsArray = [this.row, this.col, this.row-1, this.col-1, this.row+1, this.col+1];
        let edgeCount = (cellsArray[this.row+1]!== undefined) + (cellsArray[this.row-1]!== undefined) + (cellsArray[this.col+1]!== undefined) + (cellsArray[this.col-1]!== undefined);

        if(edgeCount == 4) {    // normal cell
            console.log('normal');
        } else if( edgeCount == 3) { // edge cell
            if(cellsArray[this.row+1]=== undefined){ //bottom edge missing
                num = (cellsArray[opsArray[2]][opsArray[3]].isAlive
                    +cellsArray[opsArray[2]][opsArray[1]].isAlive
                    +cellsArray[opsArray[2]][opsArray[5]].isAlive
                    +cellsArray[opsArray[0]][opsArray[3]].isAlive
                    +cellsArray[opsArray[0]][opsArray[1]].isAlive)
            } else if(cellsArray[this.row-1] === undefined) { // top edge missing
                num = (cellsArray[opsArray[0]][opsArray[3]].isAlive
                    +cellsArray[opsArray[0]][opsArray[5]].isAlive
                    +cellsArray[opsArray[4]][opsArray[3]].isAlive
                    +cellsArray[opsArray[4]][opsArray[1]].isAlive
                    +cellsArray[opsArray[4]][opsArray[5]].isAlive)
            } else if(cellsArray[this.col
                +1] === undefined) { // right edge missing
                num = (cellsArray[opsArray[2]][opsArray[3]].isAlive
                    +cellsArray[opsArray[2]][opsArray[1]].isAlive
                    +cellsArray[opsArray[0]][opsArray[3]].isAlive
                    +cellsArray[opsArray[4]][opsArray[3]].isAlive
                    +cellsArray[opsArray[4]][opsArray[1]].isAlive)
            } else {    // left edge missing
                num = (cellsArray[opsArray[2]][opsArray[1]].isAlive
                    +cellsArray[opsArray[2]][opsArray[5]].isAlive
                    +cellsArray[opsArray[0]][opsArray[5]].isAlive
                    +cellsArray[opsArray[4]][opsArray[1]].isAlive
                    +cellsArray[opsArray[4]][opsArray[5]].isAlive)
            }

            console.log(num);
        } else { // corner cell
            console.log('corner');
        }
    }

    kill() {
        this.isAlive = false;
        context.fillStyle = 'black';
        context.fillRect(this.x, this.y, res, res);
        this.draw();
    }

    born() {
        this.isAlive = true;
        context.fillStyle = "white";
        context.fillRect(this.x, this.y, res, res);
    }
}

//calculate neighbours and updates to next generation
function startGame() {
    for(let row=0; row<cellsArray.length; row++) {
        for(let col=0; col<cellsArray[row].length; col++) {
            cellsArray[row][col].countNeighbours();
        }
    }
}

setup();