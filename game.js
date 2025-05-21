const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const hero = new Hero();

let lastTime = 0;

function draw(currentTime) {
    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    requestAnimationFrame(draw);
    hero.move(deltaTime);

    ctx.fillStyle = 'deepSkyBlue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    hero.draw();
}

requestAnimationFrame(draw);