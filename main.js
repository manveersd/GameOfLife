const canvas = document.getElementById("canvas");
const clearButton = document.getElementById('clearButton');
const context = canvas.getContext('2d');
const generation = 0;
const population = 0;
const width = canvas.width;
const height = canvas.height;
let res = 10;
let cellsArray = [];
let isDragging = false;
let dragStarted = false;

//sets properties of the canvas and buttons
function setup() {
    context.fillStyle = "black"
    context.fillRect(0,0,width,height);
    context.strokeStyle='white';
    context.lineWidth=1;
    startButton.addEventListener('click', ()=>setInterval(startGame,10));

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
        this.neighbours = 0;
        //checks all 8 neighbours and updates alive neighbours count
        try {
            if(cellsArray[this.row-1][this.col-1].isAlive){this.neighbours++};                
        } catch(error) {}
        try {
            if(cellsArray[this.row-1][this.col  ].isAlive){this.neighbours++};              
        } catch(error) {}
        try {
            if(cellsArray[this.row-1][this.col+1].isAlive){this.neighbours++};                
        } catch(error) {}
        try {
            if(cellsArray[this.row  ][this.col-1].isAlive){this.neighbours++};                
        } catch(error) {}
        try {
            if(cellsArray[this.row  ][this.col+1].isAlive){this.neighbours++};                
        } catch(error) {}
        try {
            if(cellsArray[this.row+1][this.col-1].isAlive){this.neighbours++};                
        } catch(error) {}
        try {
            if(cellsArray[this.row+1][this.col  ].isAlive){this.neighbours++};                
        } catch(error) {}
        try {
            if(cellsArray[this.row+1][this.col+1].isAlive){this.neighbours++};                
        } catch(error) {} 

        return this.neighbours;
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
            let cell = cellsArray[row][col];
            cell.countNeighbours();
            if(cell.isAlive) {
                if(cell.neighbours < 2) {
                    cell.kill();
                } else if(cell.neighbours == 2 || cell.neighbours == 3) {
                    cell.born();
                } else if(cell.neighbours >3) {
                    cell.kill();
                }
            } else {
                if(cell.neighbours == 3) {
                    cell.born();
                }
            }
        }
    }
}

setup();

            