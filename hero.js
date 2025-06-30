class Hero {
    x = 110;
    y = 110;
    speed = 120; // Speed is in pixels per second
    height = 30;
    width = 24;
    img = new Image();

    constructor() {
        this.img.src = './assets/knight-sheet.png';
    }

    getBoundingBox(x, y) {
        return {x: x, y: y, height: this.height, width: this.width};
    }

    move(deltaTime) {
        const movement = (this.speed * deltaTime) / 1000;

        if (keys.get('ArrowRight')) {
            if(!util.detectMapCollision(this.getBoundingBox(this.x + movement, this.y))) {
                this.x += movement;
            }
        }

        if (keys.get('ArrowLeft')) {
            if(!util.detectMapCollision(this.getBoundingBox(this.x - movement, this.y))) {
                this.x -= movement;
            }
        }

        if (keys.get('ArrowUp')) {
            if(!util.detectMapCollision(this.getBoundingBox(this.x, this.y - movement))) {
                this.y -= movement;
            }
        }

        if (keys.get('ArrowDown')) {
            if(!util.detectMapCollision(this.getBoundingBox(this.x, this.y + movement))) {
                this.y += movement;
            }
        }
    }

    draw() {
        gameCtx.drawImage(this.img, 0, 0, 15, 19, this.x, this.y, 24, 30);
    }
}