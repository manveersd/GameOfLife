# GameOfLife
 Conway's Game of Life

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.style.border = "1px solid black";
const width = canvas.width;
const height = canvas.height;
ctx.strokeStyle = "black";
ctx.fillStyle = "green";
const res = 100;
let arr = [];
for(let row =0; row<width/res; row++){
    arr[row] = [];
  for(let col = 0; col<height/res; col++) {
    let tempCell = {x:res*row,y:res*col,isAlive:false};
    arr[row][col] = tempCell;
  }
};

function draw(arr) {
  for(let row = 0; row<arr.length; row++) {
    for(let col = 0; col< arr[row].length; col++) {
      let cell = arr[row][col];
      if(cell.isAlive) {
      ctx.rect(cell.x, cell.y, res, res);
      ctx.fill();
      } else {
      ctx.rect(cell.x, cell.y, res, res);
      ctx.stroke();        
      }
    }
  }
}

arr[0][0].isAlive = true;

draw(arr);
