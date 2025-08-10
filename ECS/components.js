class Position {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

// Used for collision detection. See Animation for display size.
// Offset is from Position component
class BoundingBox {
    constructor(offsetX = 0, offsetY = 0, width = 0, height = 0, passable = true) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = width;
        this.height = height;
        this.passable = passable;
    }
}

class Movement {
    constructor(speed = 0,
                horizontalVelocity = VELOCITY.HORIZONTAL.NONE,
                verticalVelocity = VELOCITY.VERTICAL.NONE) {
        this.speed = speed;
        this.horizontalVelocity = horizontalVelocity;
        this.verticalVelocity = verticalVelocity;
    }
}

class Direction {
    constructor(currentDirection) {
        this.currentDirection = currentDirection;
    }
}

class Combat {
    constructor(damage = 0, woundedCountdown = 1000, type = COMBAT_TYPE.NEUTRAL) {
        this.damage = damage;
        this.type = type;
        this.woundedCountdown = woundedCountdown;
        this.woundedTimer = 0;
        this.attacking = false;
    }
}

class KeyboardControls {
    constructor(keyboardControls) {
        this.keyboardControls = keyboardControls;
    }
}

class Animations {
    constructor(sheet, animations, currentAnimation, spriteWidth, spriteHeight, displayWidth, displayHeight) {
        this.sheet = sheet;
        this.animations = animations;
        this.currentAnimation = currentAnimation;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.displayHeight = displayHeight;
        this.displayWidth = displayWidth;
        this.animationTimer = 0;
    }
}

class StaticImage {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class AIControl {
    constructor(type) {
        this.type = type;
        this.movementTimer = Math.random() * 5000;
    }
}