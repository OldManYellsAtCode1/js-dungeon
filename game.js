const TILE_SIZE = 32;
const TILE_SELECTOR_SIZE = 512;

const gameCanvas = document.getElementById('game-canvas');
const gameCtx = gameCanvas.getContext('2d');

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

    hero.move(deltaTime);
    gameCtx.fillStyle = '#040720';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    map.drawMap(level1);
    hero.draw();
    editorEnabled && editor.draw();
}

requestAnimationFrame(draw);