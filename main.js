const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const textArea = document.getElementById('text');
const width = canvas.width;
const height = canvas.height;
const res = 25;
canvas.style.border = "1px solid black";
let currentArr = [];
let intervalId;
let generation = 0;
let isDragging = false;
let dragStarted = false;

function setup() {
    createInitialArray();
    draw(currentArr);
    textArea.textContent = `Generation: ${generation}`;
    startButton.addEventListener('click', drawAndUpdate);    
}

//creates first array when window loads
function createInitialArray() {
    for (let col = 0; col < width / res; col++) {
        currentArr[col] = [];
        for (let row = 0; row < height / res; row++) {
            let cell = { x: col * res, y: row * res, isAlive: false };
            currentArr[col][row] = cell;
        }
    }
}

//draw cells using mouse click or drag
function mouseControls() {

    canvas.addEventListener('mousedown', function (event) {
        isDragging = true;
        dragStarted = false;
    });

    canvas.addEventListener('mousemove', function (event) {
        if (isDragging) {
            dragStarted = true;
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;
            let affectedCell = currentArr[Math.floor(clickX / res)][Math.floor(clickY / res)];
            affectedCell.isAlive = true;
            draw(currentArr);
        }
    });

    canvas.addEventListener('mouseup', function (event) {
        isDragging = false;
    });

    canvas.addEventListener('mouseleave', function (event) {
        isDragging = false;
    });

    canvas.addEventListener('click', function (event) {
        if (!dragStarted) {
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;
            let affectedCell = cellsArray[Math.floor(clickX / res)][Math.floor(clickY / res)];
            if (affectedCell.isAlive) { affectedCell.isAlive = false }
            else { affectedCell.isAlive = true};
            draw(currentArr);
        }
    })
}

//returns count of neighbors for each cell
function countNeighbors(cell) {
    let count  = 0;
    row = cell.x/res;
    col = cell.y/res;
    try {
        if (currentArr[row - 1][col - 1].isAlive) { count++ };
    } catch (error) { }
    try {
        if (currentArr[row - 1][col    ].isAlive) { count++ };
    } catch (error) { }
    try {
        if (currentArr[row - 1][col + 1].isAlive) { count++ };
    } catch (error) { }
    try {
        if (currentArr[row    ][col - 1].isAlive) { count++ };
    } catch (error) { }
    try {
        if (currentArr[row    ][col + 1].isAlive) { count++ };
    } catch (error) { }
    try {
        if (currentArr[row + 1][col - 1].isAlive) { count++ };
    } catch (error) { }
    try {
        if (currentArr[row + 1][col    ].isAlive) { count++ };
    } catch (error) { }
    try {
        if (currentArr[row + 1][col + 1].isAlive) { count++ };
    } catch (error) { }
    return count;
}

//updates whatever array is given to it and returns new array based on some rules
function update(arr) {
    const oldArr = arr;
    let newArr = [];
    for(let col=0; col<oldArr.length; col++) {
        newArr[col] = [];
        for(let row=0; row<oldArr[col].length; row++) {
            let cell = (oldArr[col][row]);
            let count = countNeighbors(cell);
            //conditions
            let newCell = {x:cell.x, y:cell.y, isAlive:cell.isAlive};
            if(count<2){
                newCell.isAlive = false;
            } else if(count == 2 || count == 3) {
                newCell.isAlive = true;
            } else if(count > 3) {
                newCell.isAlive = false;
            }
            newArr[col][row] = newCell;
        }
    }
    return newArr;
}

//draws whatever array is given to it
function draw(arr) {
    ctx.clearRect(0,0,width,height);
    for(let col = 0; col< arr.length; col++){
        for(let row = 0; row<arr[col].length; row++) {
            let cell = arr[col][row];
            ctx.beginPath();
            ctx.rect(cell.x, cell.y, res, res);
            if(cell.isAlive){ctx.fill()}else{ctx.stroke()}
        }       
    }
}

//start function
function drawAndUpdate() {
    if (intervalId) clearInterval(intervalId);
    draw(currentArr);
    textArea.textContent = `Generation: ${generation}`;
    generation++;
    let nextArr = update(currentArr);
    [currentArr, nextArr] = [nextArr, currentArr]; // Swap arrays
    intervalId = setInterval(drawAndUpdate, 500);
}

setup();