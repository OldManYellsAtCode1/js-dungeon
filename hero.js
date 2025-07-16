class Hero {
    static DIRECTION = {
        LEFT: 'LEFT',
        RIGHT: 'RIGHT',
    };

    static ANIMATIONS = {
        idle: { frames: 4, row: 0, speed: 1 },
        walk: { frames: 6, row: 1, speed: 1 },
        attack: { frames: 3, row: 2, speed: 3 },
    };

    static SPRITE_WIDTH = 27;
    static SPRITE_HEIGHT = 22;
    static DISPLAY_WIDTH = 40;
    static DISPLAY_HEIGHT = 32;

    x = 110;
    y = 110;
    speed = 120; // Speed is in pixels per second
    height = 30;
    width = 24;
    img = new Image();
    direction;
    currentAnimation;
    animationTimer = 0;

    constructor() {
        this.img.src = './assets/knight-sheet.png';
        this.direction = Hero.DIRECTION.RIGHT;
        this.currentAnimation = Hero.ANIMATIONS.idle;
    }

    getBoundingBox(x, y) {
        return { x: x, y: y, height: this.height, width: this.width };
    }

    move(deltaTime) {
        const movement = (this.speed * deltaTime) / 1000;
        this.currentAnimation = Hero.ANIMATIONS.idle;

        if (keys.get('ArrowRight')) {
            if (!util.detectMapCollision(this.getBoundingBox(this.x + movement, this.y))) {
                this.x += movement;
            }

            this.direction = Hero.DIRECTION.RIGHT;
            this.currentAnimation = Hero.ANIMATIONS.walk;
        }

        if (keys.get('ArrowLeft')) {
            if (!util.detectMapCollision(this.getBoundingBox(this.x - movement, this.y))) {
                this.x -= movement;
            }

            this.direction = Hero.DIRECTION.LEFT;
            this.currentAnimation = Hero.ANIMATIONS.walk;
        }

        if (keys.get('ArrowUp')) {
            if (!util.detectMapCollision(this.getBoundingBox(this.x, this.y - movement))) {
                this.y -= movement;
            }

            this.currentAnimation = Hero.ANIMATIONS.walk;
        }

        if (keys.get('ArrowDown')) {
            if (!util.detectMapCollision(this.getBoundingBox(this.x, this.y + movement))) {
                this.y += movement;
            }

            this.currentAnimation = Hero.ANIMATIONS.walk;
        }

        if (keys.get('Space')) {
            this.currentAnimation = Hero.ANIMATIONS.attack;
        }
    }

    draw(deltaTime) {
        this.animationTimer += deltaTime;

        if (this.animationTimer > 1000) {
            this.animationTimer = 0;
        }

        const milliSecondsPerFrame = 1000 / (this.currentAnimation.frames * this.currentAnimation.speed);

        const frame = Math.floor(this.animationTimer / milliSecondsPerFrame) % this.currentAnimation.frames;


        let destinationX = this.x;
        let heroWidth = Hero.DISPLAY_WIDTH;
        const sourceX = frame * Hero.SPRITE_WIDTH;
        const sourceY = this.currentAnimation.row * Hero.SPRITE_HEIGHT;

        gameCtx.save();

        if (this.direction === Hero.DIRECTION.LEFT) {
            gameCtx.scale(-1, 1);

            destinationX = (destinationX - (Hero.DISPLAY_WIDTH - this.width)) * -1;
            heroWidth *= -1;
        }

        gameCtx.drawImage(
            this.img,
            sourceX, sourceY, Hero.SPRITE_WIDTH - 1, Hero.SPRITE_HEIGHT - 1,
            destinationX, this.y, heroWidth, Hero.DISPLAY_HEIGHT);

        gameCtx.restore();
    }
}