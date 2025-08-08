const TILE_SIZE = 32;
const TILE_PICKER_SIZE = 512;

const gameCanvas = document.getElementById('game-canvas');
const gameCtx = gameCanvas.getContext('2d');

const tilesetImg = new Image();
tilesetImg.src = 'assets/tileset-dungeon.png';

const knightImg = new Image();
knightImg.src = './assets/knight-sheet.png';

let currentLevel = level1;

const url = new URL(window.location.href);
const editorEnabled = url.searchParams.get('editor');

if (!editorEnabled) {
    for (const editorElement of document.getElementsByClassName('editor')) {
        editorElement.style.display = 'none';
    }
}

let lastTime = 0;

const positionComp = new Position(110, 140);
const sizeComp = new Size(24, 28);
const directionComp = new Direction(null);
const keyboardControls = new KeyboardControls();
const movement = new Movement(120);
const animationData = new Map();
animationData.set(STATE.IDLE, { frames: 4, row: 0, speed: 1 });
animationData.set(STATE.WALK, { frames: 6, row: 1, speed: 1 });
animationData.set(STATE.ATTACK, { frames: 3, row: 2, speed: 3 });

const animations = new Animations(
    knightImg,
    animationData,
    animationData.get(STATE.IDLE),
    27,
    22,
    40,
    32,
);


const world = new ECS();

const heroEntity = world.createEntity();
heroEntity.addComponent(positionComp);
heroEntity.addComponent(directionComp);
heroEntity.addComponent(keyboardControls);
heroEntity.addComponent(movement);
heroEntity.addComponent(animations);
heroEntity.addComponent(sizeComp);

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