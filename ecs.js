// Entity - just an ID that ties components together
class Entity {
    constructor(id) {
        this.id = id;
        this.components = {};
    }

    addComponent(component) {
        this.components[component.constructor.name] = component;
        return this; // for method chaining
    }

    getComponent(componentType) {
        return this.components[componentType.name];
    }

    hasComponent(componentType) {
        return !!this.components[componentType.name];
    }

    removeComponent(componentType) {
        delete this.components[componentType.name];
        return this;
    }
}

class Position {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

// Used for collision detection. See Animation for display size.
class Size {
    constructor(width = 0, height = 0, passable = true) {
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
        this.requiredComponents = [Position, Movement, Size];
        this.obstacleComponents = [Position, Size];
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
        const sizeComp = entity.getComponent(Size);

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
            x: nextPos.x,
            y: nextPos.y,
            width: sizeComp.width,
            height: sizeComp.height,
        };

        if (!util.detectMapCollision(boundingBox) &&
            !util.detectObjectCollision(boundingBox, this.obstacles)) {

            positionComp.x = nextPos.x;
            positionComp.y = nextPos.y;
        }

        // console.log(positionComp.x.toString() + " , " + positionComp.y.toString());
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


// The main Entity Component System - manages entities and systems
class ECS {
    constructor() {
        this.entities = [];
        this.systems = [];
        this.nextEntityId = 1000;
    }

    createEntity() {
        const entity = new Entity(this.nextEntityId++);
        this.entities.push(entity);
        return entity;
    }

    addSystem(system) {
        this.systems.push(system);
    }

    update(deltaTime) {
        this.systems.forEach(system => { // TODO - is passing in entities here a hack?
            system.update(this.entities, deltaTime);
        });
    }
}