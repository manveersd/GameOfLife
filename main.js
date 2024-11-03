const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const textArea = document.getElementById('text');
const width = canvas.width;
const height = canvas.height;
const input = document.getElementById("cellResolution").value; //user input of res
let res = 25; //default res
let currentArr = [];
let intervalId;
let generation = 0;
let isDragging = false;
let dragStarted = false;

function setup() {
    //res control by user
    if(input >= 10) {
        res = (parseInt(input, 10) || cellResolution);
    }
    ctx.strokeStyle = "gray";
    createInitialArray();
    mouseControls();
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
            ctx.fillRect(affectedCell.x, affectedCell.y, res, res);
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
            let affectedCell = currentArr[Math.floor(clickX / res)][Math.floor(clickY / res)];
            if(affectedCell.isAlive) {
                affectedCell.isAlive = false
                ctx.clearRect(affectedCell.x, affectedCell.y, res, res); 
                ctx.strokeRect(affectedCell.x, affectedCell.y, res,res);
            } else { affectedCell.isAlive = true 
                ctx.fillRect(affectedCell.x, affectedCell.y, res, res);
            };
        }
    })
}

//returns count of neighbors for each cell
function countNeighbors(cell) {
    let count = 0;
    row = cell.x / res;
    col = cell.y / res;
    try {
        if (currentArr[row - 1][col - 1].isAlive) { count++ };
    } catch (error) { }
    try {
        if (currentArr[row - 1][col].isAlive) { count++ };
    } catch (error) { }
    try {
        if (currentArr[row - 1][col + 1].isAlive) { count++ };
    } catch (error) { }
    try {
        if (currentArr[row][col - 1].isAlive) { count++ };
    } catch (error) { }
    try {
        if (currentArr[row][col + 1].isAlive) { count++ };
    } catch (error) { }
    try {
        if (currentArr[row + 1][col - 1].isAlive) { count++ };
    } catch (error) { }
    try {
        if (currentArr[row + 1][col].isAlive) { count++ };
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
    for (let col = 0; col < oldArr.length; col++) {
        newArr[col] = [];
        for (let row = 0; row < oldArr[col].length; row++) {
            let cell = (oldArr[col][row]);
            let count = countNeighbors(cell);
            //conditions
            let newCell = { x: cell.x, y: cell.y, isAlive: cell.isAlive };
            if (cell.isAlive) {
                // A live cell with 2 or 3 neighbors stays alive, otherwise it dies
                newCell.isAlive = (count === 2 || count === 3);
            } else {
                // A dead cell with exactly 3 neighbors becomes alive
                newCell.isAlive = (count === 3);
            }
            newArr[col][row] = newCell;
        }
    }
    return newArr;
}

//draws whatever array is given to it
function draw(arr) {
    ctx.clearRect(0, 0, width, height);
    for (let col = 0; col < arr.length; col++) {
        for (let row = 0; row < arr[col].length; row++) {
            let cell = arr[col][row];
            ctx.beginPath();
            ctx.rect(cell.x, cell.y, res, res);
            if (cell.isAlive) { ctx.fill() } else { ctx.stroke() }
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
    intervalId = setInterval(drawAndUpdate, 50);
}

setup();