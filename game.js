const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let knightX = 0;
const knightImg = new Image();
knightImg.src = './assets/knight-sheet.png';

function draw() {
    requestAnimationFrame(draw);

    ctx.fillStyle = 'deepSkyBlue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(knightImg, 0, 0, 15, 19, knightX, 0, 15, 19);

    knightX += 0.5;
}

requestAnimationFrame(draw);