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

class Action {
    constructor(action) {
        this.action = action;
    }
}

class Combat {
    constructor(damage = 0, type = COMBAT_TYPE.NEUTRAL, attackBox = null) {
        this.damage = damage;
        this.type = type;
        this.woundedTimer = 0;
        this.attackingTimer = 0;
        // The hit box for the entities attack, offset from their main bounding box
        this.attackBox = attackBox;
    }
}

class Health {
    constructor(health = 100) {
        this.health = health;
    }
}

class Points {
    constructor(points = 0) {
        this.points = points;
    }
}

class Collectable {
    constructor(health = 0, points = 0) {
        this.health = health;
        this.points = points;
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