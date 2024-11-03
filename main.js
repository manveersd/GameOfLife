const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const width = canvas.width;
const height = canvas.height;
const res = 80;
let cellArr = [];

function setup() {
    canvas.style.border = "1px solid black";
    
    //make array, draw
    for (let col = 0; col < width / res; col++) {
        cellArr[col] = [];
        for (let row = 0; row < height / res; row++) {
            let cell = { x: col * res, y: row * res, isAlive: (Math.floor(Math.random()*2)===1) };
            cellArr[col][row] = cell;
            ctx.beginPath();
            ctx.rect(cell.x, cell.y, res, res);
            if(cell.isAlive){ctx.fillStyle="green";ctx.fill()}else{ctx.stroke()}
            ctx.fillStyle = "black";
            ctx.fillText(`${row}, ${col}, ${cell.isAlive}`, (cell.x+20), (cell.y+25));
        }
    }

    //call set interval on start function
    start();
    setTimeout(start, 1000);
}

function countNeighbors(cell) {
    //returns count of neighbors
    let count  = Math.floor(Math.random()*2);
    return count; 
}

function update(arr) {
    //updates whatever array is given to it and returns new array
    const oldArr = arr;
    let newArr = [];
    for(let col=0; col<oldArr.length; col++) {
        newArr[col] = [];
        for(let row=0; row<oldArr[col].length; row++) {
            let cell = (oldArr[col][row]);
            let count = countNeighbors(cell);
            //conditions
            if(count == 1) {
                newArr[col][row] = {x:cell.x, y:cell.y, isAlive:true}
            } else{
                newArr[col][row] = {x:cell.x, y:cell.y, isAlive:false}
            }

        }
    }

    return newArr;
}

function draw(arr) {
    //draws whatever array is given to it
    ctx.clearRect(0,0,width,height);
    for(let col = 0; col< arr.length; col++){
        for(let row = 0; row<arr[col].length; row++) {
            let cell = arr[col][row];
            ctx.beginPath();
            ctx.rect(cell.x, cell.y, res, res);
            if(cell.isAlive){ctx.fillStyle="green";ctx.fill()}else{ctx.stroke()}
            ctx.fillStyle = "black";
            ctx.fillText(`${row}, ${col}, ${cell.isAlive}`, (cell.x+20), (cell.y+25));
        }       
    }
}

function start() {
    let newArr = update(cellArr);
    draw(newArr);
}

setup();