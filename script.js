const { body }= document;
const canvas  = document.createElement('canvas');
const context = canvas.getContext('2d');
const width = 400;
const height = 550;

const screenWidth = window.screen.width;
const canvasPos = screenWidth / 2 - width / 2;
const isMobile = window.matchMedia('(max-width: 600px)');
const gameoverEl = document.createElement('div');


const paddleWith = 50;
const paddleHeight = 10;

const paddleDif = 25;
let paddleBottomX = 175;
let paddleTopX = 175;
let playerMoved = false;
let paddleContact = false;

let ballX = 200;
let ballY = 275;

const ballRadius = 5;

let speedY;
let speedX;

let trajecotryX;
let comptureSpeed;

let playerScore = 0;
let computerScore = 0;

console.log(isMobile.matches)

if (isMobile.matches) {
    speedY = -2;
    speedX = speedY;
    computerSpeed = 4;
  } else {
    speedY = -1;
    speedX = speedY;
    computerSpeed = 3;
  }

function createCanvas () {
    canvas.width = width;
    canvas.height = height
    body.appendChild(canvas);
    renderCanvas();
}



function renderCanvas() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'white';

    context.fillRect(paddleBottomX, height - 20, paddleWith, paddleHeight);

    context.fillRect(paddleTopX, 10, paddleWith, paddleHeight);

    context.beginPath();
    context.setLineDash([4]);
    context.moveTo(0, 275);
    context.lineTo(400, 275);
    context.strokeStyle = 'grey';
    context.stroke();

    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();

    context.font = '30px Courier New';
    context.fillText(playerScore, 20, canvas.height / 2 + 50);
    context.fillText(computerScore, 20, canvas.height / 2 - 30);

}



function startGame() {
    playerScore = 0;
    computerScore = 0;
    ballReset();
    createCanvas();
    animate();
    canvas.addEventListener('mousemove', (e) => {
        playerMoved = true;
        paddleBottomX = e.clientX - canvasPos - paddleDif;
        if(paddleBottomX < paddleDif){
            paddleBottomX = 0;
        }
        if(paddleBottomX > width - paddleWith){
            paddleBottomX = width - paddleWith;
        }
        canvas.style.color = 'none';
    });

    function animate () {
        renderCanvas();
        ballMove();
        ballBoundaries();
        computerAI();
        window.requestAnimationFrame(animate);
    }

    function computerAI() {
        if(playerMoved) {
            if(paddleTopX + paddleDif < ballX){
                paddleTopX += computerSpeed;
            } else {
                paddleTopX  -= computerSpeed;
            }   
        }
    }

    function ballReset() {
        canvas.width = width ;
        ballX = width / 2;
        ballY = height / 2;
        speedY = -3;
        paddleContact = false;
    }

    function ballMove() {
        ballY += -speedY;
        if(playerMoved && paddleContact){
            ballX += speedX
        }
    }

    function ballBoundaries() {
        if(ballX < 0 && speedX < 0){
            speedX = -speedX;
        }
        if(ballX > width){
            speedX = -speedX;
        }
        if(ballY > height - paddleDif){
            if(ballX > paddleBottomX && ballX < paddleBottomX + paddleWith){
                paddleContact  = true;
                if(playerMoved){
                    speedY -= 1;
                    if(speedY < -5){
                        speedY = -5;
                        comptureSpeed = 6;
                    }
                }
                speedY = -speedY;
                trajecotryX = ballX - (paddleBottomX + paddleDif);
                speedX = trajecotryX * 0.3;
            } else if(ballY > height){
                ballReset();
                computerScore++;
            }
        }
        if(ballY < paddleDif){
            if(ballX > paddleTopX && ballX < paddleTopX + paddleWith){
                if (playerMoved) {
                    speedY += 1;
                    if (speedY > 5) {
                      speedY = 5;
                    }
                  }
                  speedY = -speedY;
            } else if (ballY < 0) {
                ballReset();
                playerScore++;
            }            
        }
    }
}

startGame();