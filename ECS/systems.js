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

class KeyboardControlSystem extends AbstractSystem {
    constructor() {
        super();
        this.requiredComponents = [KeyboardControls, Position, Direction, Movement, Action];

        let actions = new Map();
        actions.set(USER_COMMANDS.RIGHT, (movementComp, directionComp, actionComp) => {
            movementComp.horizontalVelocity = VELOCITY.HORIZONTAL.RIGHT;
            directionComp.currentDirection = DIRECTION.RIGHT;
            actionComp.action = ACTION.WALK;
        });
        actions.set(USER_COMMANDS.LEFT, (movementComp, directionComp, actionComp) => {
            movementComp.horizontalVelocity = VELOCITY.HORIZONTAL.LEFT;
            directionComp.currentDirection = DIRECTION.LEFT;
            actionComp.action = ACTION.WALK;
        });
        actions.set(USER_COMMANDS.UP, (movementComp, directionComp, actionComp) => {
            movementComp.veriticalVelocity = VELOCITY.VERTICAL.UP;
            actionComp.action = ACTION.WALK;
        });
        actions.set(USER_COMMANDS.DOWN, (movementComp, directionComp, actionComp) => {
            movementComp.veriticalVelocity = VELOCITY.VERTICAL.DOWN;
            actionComp.action = ACTION.WALK;
        });
        actions.set(USER_COMMANDS.ATTACK, (movementComp, directionComp, actionComp) => {
            actionComp.action = ACTION.ATTACK;
        });

        this.actions = actions;
    }

    updateForEntity(entity) {
        const movementComp = entity.getComponent(Movement);
        const directionComp = entity.getComponent(Direction);
        const keyboardControlComp = entity.getComponent(KeyboardControls);
        const actionComp = entity.getComponent(Action);

        movementComp.horizontalVelocity = VELOCITY.HORIZONTAL.NONE;
        movementComp.veriticalVelocity = VELOCITY.VERTICAL.NONE;
        actionComp.action = ACTION.IDLE;

        for (const [control, action] of keyboardControlComp.keyboardControls) {
            if (keys.get(control)) {
                this.actions.get(action)(movementComp, directionComp, actionComp);
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
        this.requiredComponents = [Position, Animations, Direction, Action];
    }

    updateForEntity(entity, deltaTime) {
        const positionComp = entity.getComponent(Position);
        const animationsComp = entity.getComponent(Animations);
        const directionComp = entity.getComponent(Direction);
        const actionComp = entity.getComponent(Action);
        const combatComp = entity.getComponent(Combat);

        let wounded = combatComp && combatComp.woundedTimer > 0;

        animationsComp.currentAnimation = animationsComp.animations.get(actionComp.action);

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


        if (wounded) {
            if (Math.floor(animationTimer / 100) % 2 === 0) { // Flash 5 time a second
                gameCtx.filter = 'brightness(1000%)';
            }
        }

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
        this.requiredComponents = [Position, BoundingBox, Direction, Combat, Action];
        this.enemyComponents = [Position, BoundingBox, Combat, Health];
        this.enemies = [];
    }

    before(entities, deltaTime) {
        this.enemies = [];
        entities.forEach(entity => {
            if (this.enemyComponents.every(comp => entity.hasComponent(comp))) {
                this.enemies.push(entity);
            }
        });
    };

    updateForEntity(entity, deltaTime) {
        const positionComp = entity.getComponent(Position);
        const boundingBoxComp = entity.getComponent(BoundingBox);
        const combatComp = entity.getComponent(Combat);
        const actionComp = entity.getComponent(Action);
        const directionComp = entity.getComponent(Direction);

        combatComp.attckingTimer -= deltaTime;
        combatComp.woundedTimer -= deltaTime;

        let boundingBox = {
            x: positionComp.x + boundingBoxComp.offsetX,
            y: positionComp.y + boundingBoxComp.offsetY,
            width: boundingBoxComp.width,
            height: boundingBoxComp.height,
        };

        let attackers = util.detectObjectCollisions(boundingBox, this.enemies);

        for (const attacker of attackers) {
            // TODO: For now we hardcode that you can only attack enemies with a different combat type.
            if (attacker !== entity && attacker.getComponent(Combat).type !== combatComp.type) {
                if (combatComp.type === COMBAT_TYPE.MONSTER) { // TODO: Hardcode monsters to always attack for now
                    if (combatComp.attckingTimer <= 0) {
                        combatComp.attckingTimer = 100;
                    }

                    if (attacker.getComponent(Combat).woundedTimer <= 0) {
                        console.log('wounded');
                        attacker.getComponent(Combat).woundedTimer = 500;
                        attacker.getComponent(Health).health -= 10;
                        console.log(attacker.id + ' - health: ' + attacker.getComponent(Health).health);
                    }
                }
                //console.log('Attack detected');
            }
        }

        // TODO - this is just wrong - should be testing for existence of attackBox
        if (combatComp.type === COMBAT_TYPE.PLAYER && actionComp.action === ACTION.ATTACK) {
            // TODO - check for null attackBox, see above
            let isRight = directionComp.currentDirection === DIRECTION.RIGHT;

            let xPos;

            if (isRight) {
                xPos = boundingBox.x + combatComp.attackBox.x;
            } else {
                xPos = (boundingBox.x + boundingBox.width) - combatComp.attackBox.x - combatComp.attackBox.width;
                debugger;
            }

            let attackBox = {
                x: xPos,
                y: boundingBox.y + combatComp.attackBox.y,
                width: combatComp.attackBox.width,
                height: combatComp.attackBox.height,
            };

            let attackerCollisions = util.detectObjectCollisions(attackBox, this.enemies);

            for (const attacker of attackerCollisions) {
                if (attacker !== entity && attacker.getComponent(Combat).woundedTimer <= 0) {
                    attacker.getComponent(Combat).woundedTimer = 500;

                    attacker.getComponent(Health).health -= 10;
                    attacker.getComponent(Health).health -= 10;
                    console.log(attacker.id + ' - health: ' + attacker.getComponent(Health).health);
                }
            }
        }

        if (combatComp.attckingTimer > 0) { // TODO - move this to AI system? -- maybe CD should leave in hits in a component?
            actionComp.action = ACTION.ATTACK;
        } else if (actionComp.action === ACTION.ATTACK) {
            actionComp.action = ACTION.IDLE;
        }
    }
}

class CollectableSystem extends AbstractSystem {
    constructor() {
        super();
        this.requiredComponents = [KeyboardControls, Position, BoundingBox, Health, Points];
        this.collectables = [];
    }

    before(entities, deltaTime) {
        this.collectables = [];
        entities.forEach(entity => {
            if (entity.hasComponent(Collectable)) {
                this.collectables.push(entity);
            }
        });
    };

    updateForEntity(entity, deltaTime) {
        const positionComp = entity.getComponent(Position);
        const boundingBoxComp = entity.getComponent(BoundingBox);
        const healthComp = entity.getComponent(Health);
        const pointsComp = entity.getComponent(Points);

        let boundingBox = {
            x: positionComp.x + boundingBoxComp.offsetX,
            y: positionComp.y + boundingBoxComp.offsetY,
            width: boundingBoxComp.width,
            height: boundingBoxComp.height,
        };

        let collectables = util.detectObjectCollisions(boundingBox, this.collectables);

        for (const collectable of collectables) {
            const collectableComp = collectable.getComponent(Collectable);
            const collectableActionComp = collectable.getComponent(Action);

            healthComp.health += collectableComp.health;
            pointsComp.points += collectableComp.points;

            collectableActionComp.action = ACTION.DEAD;

            console.log(entity.id + ' - health: ' + healthComp.health + ' , points: ' + pointsComp.points);
        }
    }
}

class HealthSystem extends AbstractSystem {
    constructor() {
        super();
        this.requiredComponents = [Health, Action];
    }

    updateForEntity(entity, deltaTime) {
        const healthComp = entity.getComponent(Health);
        const actionComp = entity.getComponent(Action);

        if(healthComp.health <= 0) {
            actionComp.action = ACTION.DEAD;
        }
    }
}

