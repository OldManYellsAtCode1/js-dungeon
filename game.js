const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let boxX = 0;

function draw() {
    requestAnimationFrame(draw);

    ctx.fillStyle = 'deepSkyBlue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'orange';
    ctx.fillRect(boxX, 0, 100, 100);
}

requestAnimationFrame(draw);