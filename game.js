const TILE_SIZE = 32;
const TILE_PICKER_SIZE = 512;

const gameCanvas = document.getElementById('game-canvas');
const gameCtx = gameCanvas.getContext('2d');

const knightImg = new Image();
knightImg.src = './assets/knight-sheet.png';

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

let lastTime = 0;

const world = new ECS();

world.addSystem(new PlayerControlSystem());
world.addSystem(new MovementSystem());
world.addSystem(new StaticImageSystem());
world.addSystem(new AnimationSystem());

levelLoader(currentLevel, world);

function draw(currentTime) {
    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    requestAnimationFrame(draw);

    gameCtx.fillStyle = '#040720';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    map.draw();
    editorEnabled && editor.draw();
    world.update(deltaTime);
}

requestAnimationFrame(draw);