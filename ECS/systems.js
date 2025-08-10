class AbstractSystem {
    requiredComponents = [];

    update(entities, deltaTime) {
        this.before(entities, deltaTime);

        entities.forEach(entity => {
            if (this.requiredComponents.every(comp => entity.hasComponent(comp))) {
                this.updateForEntity(entity, deltaTime);
            }
        });
    }

    // Give the system the chance to do something once per frame. E.g. grab other entities the system needs
    // to know about.
    before(entities, deltaTime) {
    };

    updateForEntity(entity, deltaTime) {
    };
}

class PlayerControlSystem extends AbstractSystem {
    constructor() {
        super();
        this.requiredComponents = [KeyboardControls, Position, Direction, Animations, Movement];

        let actions = new Map();
        actions.set(USER_COMMANDS.RIGHT, (movementComp, directionComp, animationComp) => {
            movementComp.horizontalVelocity = VELOCITY.HORIZONTAL.RIGHT;
            directionComp.currentDirection = DIRECTION.RIGHT;
            animationComp.currentAnimation = animationComp.animations.get(STATE.WALK);
        });
        actions.set(USER_COMMANDS.LEFT, (movementComp, directionComp, animationComp) => {
            movementComp.horizontalVelocity = VELOCITY.HORIZONTAL.LEFT;
            directionComp.currentDirection = DIRECTION.LEFT;
            animationComp.currentAnimation = animationComp.animations.get(STATE.WALK);
        });
        actions.set(USER_COMMANDS.UP, (movementComp, directionComp, animationComp) => {
            movementComp.veriticalVelocity = VELOCITY.VERTICAL.UP;
            animationComp.currentAnimation = animationComp.animations.get(STATE.WALK);
        });
        actions.set(USER_COMMANDS.DOWN, (movementComp, directionComp, animationComp) => {
            movementComp.veriticalVelocity = VELOCITY.VERTICAL.DOWN;
            animationComp.currentAnimation = animationComp.animations.get(STATE.WALK);
        });
        actions.set(USER_COMMANDS.ATTACK, (movementComp, directionComp, animationComp) => {
            animationComp.currentAnimation = animationComp.animations.get(STATE.ATTACK);
        });

        this.actions = actions;
    }

    updateForEntity(entity) {
        const movementComp = entity.getComponent(Movement);
        const directionComp = entity.getComponent(Direction);
        const animationComp = entity.getComponent(Animations);
        const keyboardControlComp = entity.getComponent(KeyboardControls);

        movementComp.horizontalVelocity = VELOCITY.HORIZONTAL.NONE;
        movementComp.veriticalVelocity = VELOCITY.VERTICAL.NONE;
        animationComp.currentAnimation = animationComp.animations.get(STATE.IDLE);

        for (const [control, action] of keyboardControlComp.keyboardControls) {
            if (keys.get(control)) {
                this.actions.get(action)(movementComp, directionComp, animationComp);
            }
        }
    }
}

class MovementSystem extends AbstractSystem {
    constructor() {
        super();
        this.requiredComponents = [Position, Movement, BoundingBox];
        this.obstacleComponents = [Position, BoundingBox];
        this.obstacles = [];
    }

    before(entities, deltaTime) {
        // Find any objects we will need to test against
        this.obstacles = [];
        entities.forEach(entity => {
            if (this.obstacleComponents.every(comp => entity.hasComponent(comp))) {
                this.obstacles.push(entity);
            }
        });
    };

    updateForEntity(entity, deltaTime) {
        const positionComp = entity.getComponent(Position);
        const movementComp = entity.getComponent(Movement);
        const boundingBoxComp = entity.getComponent(BoundingBox);

        let nextPos = { x: positionComp.x, y: positionComp.y };
        const increment = (movementComp.speed * deltaTime) / 1000;

        if (movementComp.horizontalVelocity === VELOCITY.HORIZONTAL.RIGHT) {
            nextPos = { x: nextPos.x + increment, y: nextPos.y };
        }

        if (movementComp.horizontalVelocity === VELOCITY.HORIZONTAL.LEFT) {
            nextPos = { x: nextPos.x - increment, y: nextPos.y };
        }

        if (movementComp.veriticalVelocity === VELOCITY.VERTICAL.UP) {
            nextPos = { x: nextPos.x, y: nextPos.y - increment };
        }

        if (movementComp.veriticalVelocity === VELOCITY.VERTICAL.DOWN) {
            nextPos = { x: nextPos.x, y: nextPos.y + increment };
        }

        let boundingBox = {
            x: nextPos.x + boundingBoxComp.offsetX,
            y: nextPos.y + boundingBoxComp.offsetY,
            width: boundingBoxComp.width,
            height: boundingBoxComp.height,
        };

        if (util.detectMapCollision(boundingBox)) {
            return;
        }

        let obstacles = util.detectObjectCollisions(boundingBox, this.obstacles);

        for (const obstacle of obstacles) {
            if (obstacle !== entity && !obstacle.getComponent(BoundingBox).passable) {
                return;
            }
        }

        positionComp.x = nextPos.x;
        positionComp.y = nextPos.y;
    }
}

class AnimationSystem extends AbstractSystem {
    constructor() {
        super();
        this.requiredComponents = [Position, Animations, Direction];
    }

    updateForEntity(entity, deltaTime) {
        const positionComp = entity.getComponent(Position);
        const animationsComp = entity.getComponent(Animations);
        const directionComp = entity.getComponent(Direction);
        let currentAnimation = animationsComp.currentAnimation;
        let animationTimer = animationsComp.animationTimer;

        animationTimer += deltaTime;

        if (animationTimer > 1000) {
            animationTimer = 0;
        }

        const milliSecondsPerFrame = 1000 / (currentAnimation.frames * currentAnimation.speed);

        const frame = Math.floor(animationTimer / milliSecondsPerFrame) % currentAnimation.frames;

        // console.log('frame:' + frame + ' milliSecondsPerFrame: ' + milliSecondsPerFrame);

        let destinationX = positionComp.x;
        const sourceX = frame * animationsComp.spriteWidth;
        const sourceY = currentAnimation.row * animationsComp.spriteHeight;

        let displayWidth = animationsComp.displayWidth;

        gameCtx.save();

        if (directionComp.currentDirection === DIRECTION.LEFT) {
            gameCtx.scale(-1, 1);

            destinationX = (destinationX - (animationsComp.displayWidth - animationsComp.spriteWidth)) * -1;
            displayWidth *= -1;
        }

        gameCtx.drawImage(
            animationsComp.sheet,
            sourceX, sourceY, animationsComp.spriteWidth - 1, animationsComp.spriteHeight - 1,
            destinationX, positionComp.y, displayWidth, animationsComp.displayHeight);

        gameCtx.restore();

        animationsComp.animationTimer = animationTimer;
    }
}

class StaticImageSystem extends AbstractSystem {
    constructor() {
        super();
        this.requiredComponents = [Position, StaticImage];
    }

    updateForEntity(entity, deltaTime) {
        const positionComp = entity.getComponent(Position);
        const staticImageComp = entity.getComponent(StaticImage);

        gameCtx.drawImage(
            staticImageComp.image,
            staticImageComp.x, staticImageComp.y, staticImageComp.width, staticImageComp.height,
            positionComp.x, positionComp.y, staticImageComp.width, staticImageComp.height);
    }
}

class CombatSystem extends AbstractSystem {
    constructor() {
        super();
        this.requiredComponents = [Position, BoundingBox, Combat];
        this.enemyComponents = [Position, BoundingBox, Combat];
        this.enemies = [];
    }

    before(entities, deltaTime) {
        // Find any enemies we will need to test against
        this.enemies = [];
        entities.forEach(entity => {
            if (this.enemyComponents.every(comp => entity.hasComponent(comp))) {
                this.enemies.push(entity);
            }
        });
    };

    updateForEntity(entity, deltaTime) {
        const positionComp = entity.getComponent(Position);
        const movementComp = entity.getComponent(Movement);
        const boundingBoxComp = entity.getComponent(BoundingBox);
        const combatComp = entity.getComponent(Combat);

        let boundingBox = {
            x: positionComp.x + boundingBoxComp.offsetX,
            y: positionComp.y + boundingBoxComp.offsetY,
            width: boundingBoxComp.width,
            height: boundingBoxComp.height,
        };

        let attackers = util.detectObjectCollisions(boundingBox, this.enemies);

        for (const attacker of attackers) {
            // For now we hardcode that you can only attack enemies with a different combat type.
            if (attacker !== entity && attacker.getComponent(Combat).type !== combatComp.type) {
                debugger;
                console.log('Attack detected');
            }
        }
    }
}
