//Canvas Setup
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * .83;

//Scoreboard Setup
var scoreText = document.getElementById("score");
var livesText = document.getElementById("lives");
var restartButton = document.getElementById("restart");
restartButton.onclick = initialize;

//Initiallize brick variables
var column_count = 5;
var row_count = 5;
var bricks = [];
var offsetLeft = canvas.width / 6.25;
var offsetTop = canvas.width / 30;

//Initialize scoreboard variables
var score;
var lives;
var numBricks;

//Add event listeners
var leftPressed;
var rightPressed;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//Game Objects
 var ball = {
   radius: 25,
   x: canvas.width/2,
   y: canvas.height/2,
   dx: 3,
   dy: 5,
   color: "white"
 };

var paddle = {
  width: canvas.width / 7,
  height: canvas.height / 50,
  x: 0,
  y: 0,
  color: '#97b4ef',
  outline: "#a09d9dte"
}
paddle.x = (canvas.width - paddle.width) / 2;
paddle.y = (canvas.height - (paddle.height + 25));


//////////////////////////////////////////////////////
function initialize () 
{
  //Assign scoreboard values
  lives = 3;
  livesText.innerHTML = lives;
  score = 0;
  scoreText.innerHTML = score;

  //Set ball & paddle properties on game reset when intialize is called
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 3;
  ball.dy =  5;
  
  paddle.x = (canvas.width - paddle.width) / 2;
  paddle.y = (canvas.height - (paddle.height + 25));


  // create bricks
  var colors = ["darkred", "red", "darkorange", "orange", "lime"]
  for (var col=0; col < column_count; col++)
  {
    bricks[col] = [];
    for (var row=0; row < row_count; row++)
    {
      var brick = {
        width: canvas.width / 7.5,
        height: canvas.height / 20,
        padding: 20,
        x: 0,
        y: 0,
        color: colors[row],
        status: 1
      };
      bricks[col][row] = brick;
    }
  }
  numBricks = bricks.length * bricks.length;
}

//Handle events when a key is pressed done and held
function keyDownHandler(e)
{
  switch (e.key)
    {
      case "ArrowLeft":
        leftPressed = true;
        break;
      case "ArrowRight":
        rightPressed = true;
        break;
    }
}

//Hanlde events when a key is lifted from previously being in the pressed state
function keyUpHandler(e)
{
  switch (e.key)
    {
      case "ArrowLeft":
        leftPressed = false;
        break;
      case "ArrowRight":
        rightPressed = false;
        break;
    }
}

//Draw and update bricks on screen
function drawBricks() {
  for (var col=0; col<column_count; col++)
  {
    for (var row=0; row<row_count; row++)
    {
      var brick = bricks[col][row];
      if (brick.status == 1)
      {
        brick.x = (col * (brick.width + brick.padding)) + offsetLeft;
        brick.y = (row * (brick.height + brick.padding)) + offsetTop;
      
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.width, brick.height);
        ctx.fillStyle = brick.color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//Draw and update ball on screen
function drawBall () {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.stroke();
}

//draw and update paddle on screen
function drawPaddle ()
{
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = paddle.color;
  ctx.strokeStyle = paddle.outline;
  ctx.fill();
  ctx.stroke();
}


//Check for collisions between game objects
function collision() 
{
  for (var col=0; col<column_count; col++)
    {
     for (var row=0; row<row_count; row++)
       {
         var brick = bricks[col][row];
         if (brick.status == 1)
           {
             if (
               ((ball.x + ball.radius) > brick.x) &&
               ((ball.x - ball.radius) < (brick.x + brick.width)) &&
               ((ball.y + ball.radius) > brick.y) &&
               ((ball.y - ball.radius) < (brick.y + brick.height)) 
                )
                 {
                    ball.dy = -ball.dy;
                    brick.status = 0;
                    score += 10;
                    scoreText.innerHTML = score;
                    numBricks -= 1;
                    if (numBricks == 0) 
                    {
                      alert("You Win!");
                      ball.dx = 0;
                      ball.dy = 0;
                    }
                 }
           }
       }
    }
}

//reset ball and paddle positions
function reset()
{
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 3;
  ball.dy =  5;
  
  paddle.x = (canvas.width - paddle.width) / 2;
  paddle.y = (canvas.height - (paddle.height + 25));
}


//infinite animation loop to run and update game values
function animate()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawBall();
  drawPaddle();
  drawBricks();
  collision();

  //check vertical wall collision
  if ((ball.x + ball.radius) > canvas.width || (ball.x - ball.radius) < 0) 
  {
    ball.dx = -ball.dx;
  }
  
  
  if ((ball.y + ball.radius) > canvas.height || (ball.y - ball.radius) < 0) 
  {
    ball.dy = -ball.dy;
  }


  ball.x += ball.dx;
  ball.y += ball.dy;

  
  if (
      (ball.y + ball.radius) > paddle.y
     )
      {
        if (
          ((ball.x + ball.radius) > paddle.x) &&
          ((ball.x - ball.radius) < paddle.x + paddle.width)
        ) 
          {
              ball.dy = -ball.dy
          }
        else {
            lives -= 1;
            livesText.innerHTML = lives;
            reset();
            if (lives == 0)
            {
              alert("Sorry, out of lives. Press the Restart button to play again")
              ball.dx = 0;
              ball.dy = 0;
            }
          }
        }
      

    
  if (rightPressed && paddle.x < (canvas.width - paddle.width))
  {
    paddle.x += 7;
  }
  else if (leftPressed && paddle.x > 0)
  {
    paddle.x -= 7;
  }
  
  requestAnimationFrame(animate);
 
}

//////////////////////////////////////////////////////

//Main 
initialize();
animate();