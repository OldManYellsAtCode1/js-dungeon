const TILE_SIZE = 32;
const TILE_PICKER_SIZE = 512;

const gameCanvas = document.getElementById('game-canvas');
const gameCtx = gameCanvas.getContext('2d');

const tilesetImg = new Image();
tilesetImg.src = 'assets/tileset-dungeon.png';

let currentLevel = level1;

const url = new URL(window.location.href);
const editorEnabled = url.searchParams.get('editor');

if (!editorEnabled) {
    for (const editorElement of document.getElementsByClassName('editor')) {
        editorElement.style.display = 'none';
    }
}

const hero = new Hero();

let lastTime = 0;

function draw(currentTime) {
    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    requestAnimationFrame(draw);

    gameCtx.fillStyle = '#040720';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    map.draw();
    hero.move(deltaTime);
    hero.draw(deltaTime);
    editorEnabled && editor.draw();
}

requestAnimationFrame(draw);