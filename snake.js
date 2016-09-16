document.addEventListener("DOMContentLoaded", function() {

//define game board' variables

var box = document.getElementById("box");
var context = box.getContext("2d");
var width = box.width;
var height = box.height;


//grid of 10/10 blocks to fit game's elements

var blockSize = 10;
var blockWidth = width/blockSize;
var blockHeight = height/blockSize;
console.log(blockHeight);

//create border

var boxBorder = function (){
  context.fillStyle = "gray";
  context.fillRect(0, 0, width, blockSize);
  context.fillRect(0, height - blockSize, width, blockSize);
  context.fillRect(0, 0, blockSize, width);
  context.fillRect(width - blockSize, 0, blockSize, height);

};



//define result and position

var result = 0;

var yourResult = function() {

  context.textBaseline = "top";
  context.textAlign = "left";
  context.font = "15px Verdana";
  context.fillStyle = "red";
  context.fillText("Twój wynik: " +  result, 15, blockSize);

};

//"game over" + clearInterval when game is over

var gameOver = function() {

  clearInterval(interval);
  context.font = "60px Verdana";
  context.fillStyle = "red";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("Game Over", width/2, height/2);

};

//drawing circle (future apple)

var circle = function (x, y, radius, fillCircle) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, false);

  if (fillCircle) {
    context.fill();
  }else {
    context.stroke();
  }

};


//define object constructor in grid

var Block = function (column, row) {
  this.column = column;
  this.row = row;
};

//drawing square using block prototype

Block.prototype.drawSquare = function (color) {
  var x = this.column * blockSize;
  var y = this.row * blockSize;
  context.fillStyle = color;
  context.fillRect(x, y, blockSize, blockSize);
};

//drawing circle using block prototype

Block.prototype.drawCircle = function (color) {
  var middleOfX = this.column * blockSize + blockSize/2;
  var middleOfY = this.row * blockSize + blockSize/2;
  context.fillStyle = color;
  circle(middleOfX, middleOfY, blockSize/2, true);

};


//checking position of blocks

Block.prototype.compare = function (anotherBlock) {

    return this.column === anotherBlock.column &&
    this.row === anotherBlock.row;

};

//Snake constructor

var Snake = function() {
  this.parts = [
    new Block(7,5),
    new Block(6,5),
    new Block(5,5)
  ];

  this.direction = "right";
  this.anotherDirection = "right";
};

//changing snake into square

Snake.prototype.draw = function() {

  for(var i=0; i < this.parts.length; i++) {
    this.parts[i].drawSquare("blue");
  }
};

//head and checking directions

Snake.prototype.move = function() {

  var head = this.parts[0];
  var newHead;

  this.direction = this.anotherDirection;

  if (this.direction === "right") {
    newHead = new Block(head.column + 1, head.row);
  }else if (this.direction === "bottom") {
    newHead = new Block(head.column, head.row + 1);
  }else if (this.direction === "left") {
    newHead = new Block(head.column - 1, head.row);
  }else if (this.direction === "top") {
    newHead = new  Block(head.column, head.row - 1);
  }

  if (this.accident(newHead)) {
    gameOver();
    return;
  }

  this.parts.unshift(newHead);

  if(newHead.compare(apple.position)) {
    result++;
    apple.somewhere();
  }else {
    this.parts.pop();
  }

};

//checking head-wall/head-tail crash

Snake.prototype.accident = function(head) {
  var leftAccident = (head.column === 0);
  var topAccident = (head.row === 0);
  var rigthAccident = (head.column === blockWidth - 1);
  var bottomAccident = (head.row === blockHeight - 1);

  var borderAccident = leftAccident || topAccident || rigthAccident || bottomAccident;

  var tailAccident = false;

  for (var i=0; i < this.parts.length; i++) {
    if(head.compare(this.parts[i])) {
      tailAccident = true;
    }
  }

  return borderAccident || tailAccident;

};

//define next direction of snake, when user pressed key

Snake.prototype.setDirection = function(newDirection) {
  if(this.direction === "top" && newDirection === "bottom") {
    return;
  }else if (this.direction === "right" && newDirection === "left") {
    return;
  }else if (this.direction === "bottom" && newDirection === "top") {
    return;
  }else if (this.direction === "left" && newDirection === "right") {
    return;
  }

  this.anotherDirection = newDirection;
};

//define position of Apple

var Apple = function() {
  this.position = new Block (10, 10);
};

//define Apple as circle

Apple.prototype.draw = function() {
  this.position.drawCircle("green");
};

//Apple in random place on game board

Apple.prototype.somewhere = function() {
  var randomColumn = Math.floor(Math.random() * (blockWidth - 2)) +1;
  var randomRow = Math.floor(Math.random() * (blockHeight - 2)) +1;
  this.position = new Block(randomColumn, randomRow);
};

//define new snake and apple

var snake = new Snake();
var apple = new Apple();

//send animations to setInterval function

var interval = setInterval(function() {
  context.clearRect(0,0, width, height);
  yourResult();
  snake.move();
  snake.draw();
  apple.draw();
  boxBorder();
}, 100);

//define directions (key's code)

var directions = {
  37: "left",
  38: "top",
  39: "right",
  40: "bottom"
};

//define keydown function to be able to use keybord
$("body").keydown(function(event){
  var newDirection = directions[event.keyCode];
  if(newDirection !== undefined) {
    snake.setDirection(newDirection);
  }
});

  });
