const TILE_SIZE = 32;
const TILE_PICKER_SIZE = 512;

const gameCanvas = document.getElementById('game-canvas');
const gameCtx = gameCanvas.getContext('2d');

const knightImg = new Image();
const tilesetImg = new Image();
const slimeImg = new Image();

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
world.addSystem(new AIControlSystem());
world.addSystem(new MovementSystem());
world.addSystem(new StaticImageSystem());
world.addSystem(new AnimationSystem());

util.loadImages(
    [
        [knightImg, './assets/knight-sheet.png'],
        [tilesetImg, './assets/tileset-dungeon.png'],
        [slimeImg, './assets/slime.png'],
    ],
).then(() => {
    loadLevel(currentLevel, world);
    requestAnimationFrame(draw);
});

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
