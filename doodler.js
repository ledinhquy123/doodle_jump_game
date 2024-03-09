// board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

// doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight * 7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}

// physics
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -7;
let gravity = 0.4;

// platforms
let platformArray = [];
let platformWith = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let highScore = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    // load images
    doodlerRightImg = new Image();
    doodlerRightImg.src = "image/doodler-right.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function() {
        context.drawImage(doodlerRightImg, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "image/doodler-left.png";
    platformImg = new Image();
    platformImg.src = "image/platform.png";

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
    document.getElementById("retry").addEventListener("click", hideEndMenu);
}

function update() {
    requestAnimationFrame(update);
    if(gameOver) return;
    context.clearRect(0, 0, boardWidth, boardHeight);

    doodler.x += velocityX;
    if(doodler.x > boardWidth){
        doodler.x = 0;
    }else if(doodler.x + doodlerWidth < 0){
        doodler.x = boardWidth;
    }
    velocityY += gravity;
    doodler.y += velocityY;
    if(doodler.y > boardHeight) gameOver = true;

    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    // platforms
    for(let i = 0; i < platformArray.length; i++){
        platform = platformArray[i];
        if(doodler.y < boardHeight * 3/4 && velocityY < 0){
            platform.y -= initialVelocityY;
        }
        if(detectCollision(doodler, platform) && velocityY >= 0){
            velocityY = initialVelocityY;
        }
        context.drawImage(platformImg, platform.x, platform.y, platform.width, platform.height);
    } 

    while(platformArray.length > 0 && platformArray[0].y >= boardHeight){
        platformArray.shift();
        newPlatform();
        if(velocityY < 0) updateScore();
        highScore = Math.max(highScore, score);
    }

    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText("Score: ", 5, 20);
    context.fillText(score, 55, 20);

    if(gameOver){
        showEndMenu();
    }
}

function moveDoodler(e) {
    if(e.code == "ArrowRight" || e.code == "keyD"){
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }else if(e.code == "ArrowLeft" || e.code == "keyA"){
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }else if(gameOver && e.code == "Space"){
        resetGame();
    }
}

function placePlatforms() {
    platformArray = [];

    let platform = {
        img : platformImg,
        x : boardWidth/2 - doodlerWidth/2,
        y : boardHeight - 50,
        width : platformWith,
        height : platformHeight
    }
    platformArray.push(platform);

    for(let i = 0; i < 6; i++){
        let randomX = Math.floor(Math.random() * boardWidth * 3/4);
        platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWith,
            height : platformHeight
        }
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth * 3/4);
    platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWith,
        height : platformHeight
    }
    platformArray.push(platform);
}

function detectCollision(a, b){
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}
function updateScore() {
    score++;
}

function resetGame() {
    doodler = {
        img : doodlerRightImg,
        x : doodlerX,
        y : doodlerY,
        width : doodlerWidth,
        height : doodlerHeight
    }
    velocityX = 0;
    velocityY = initialVelocityY;
    score = 0;
    highScore = highScore;
    gameOver = false;
    placePlatforms();
    hideEndMenu();
}

function showEndMenu() {
    document.getElementById("end-game-menu").style.display = "block";
    document.getElementById("score").innerHTML = score;
    document.getElementById("high-score").innerHTML = highScore;
}

function hideEndMenu() {
    document.getElementById("end-game-menu").style.display = "none";
    resetGame();
}