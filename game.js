const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let knightX = 0;
let knightY = 0;

const knightImg = new Image();
knightImg.src = './assets/knight-sheet.png';

function draw() {
    requestAnimationFrame(draw);

    ctx.fillStyle = 'deepSkyBlue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(knightImg, 0, 0, 15, 19, knightX, knightY, 15, 19);

    if (keys.get('ArrowRight')) {
        knightX += 0.5;
    }

    if (keys.get('ArrowLeft')) {
        knightX -= 0.5;
    }

    if (keys.get('ArrowUp')) {
        knightY -= 0.5;
    }

    if (keys.get('ArrowDown')) {
        knightY += 0.5;
    }
}

requestAnimationFrame(draw);