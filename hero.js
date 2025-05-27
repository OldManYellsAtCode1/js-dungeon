class Hero {
    x = 400;
    y = 320;
    speed = 120; // Speed is in pixels per second
    img = new Image();

    constructor() {
        this.img.src = './assets/knight-sheet.png';
    }

    move(deltaTime) {
        const movement = (this.speed * deltaTime) / 1000;

        if (keys.get('ArrowRight')) {
            this.x += movement;
        }

        if (keys.get('ArrowLeft')) {
            this.x -= movement;
        }

        if (keys.get('ArrowUp')) {
            this.y -= movement;
        }

        if (keys.get('ArrowDown')) {
            this.y += movement;
        }
    }

    draw() {
        ctx.drawImage(hero.img, 0, 0, 15, 19, hero.x, hero.y, 24, 30);
    }
}