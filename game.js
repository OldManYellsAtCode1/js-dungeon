const TILE_SIZE = 32;
const TILE_SELECTOR_SIZE = 512;

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const tilesetImg = new Image();
tilesetImg.src = 'assets/tileset-dungeon.png';

const url = new URL(window.location.href);
const editorEnabled = url.searchParams.get('editor');

if (!editorEnabled) {
    for (const editorElement in document.getElementById('editor')) {
        editorElement.style.display = 'none';
    }
}

const hero = new Hero();

let lastTime = 0;

function draw(currentTime) {
    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    requestAnimationFrame(draw);

    editorEnabled && editor.draw();
    hero.move(deltaTime);
    ctx.fillStyle = '#040720';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    map.drawMap(level1);
    hero.draw();
}

requestAnimationFrame(draw);