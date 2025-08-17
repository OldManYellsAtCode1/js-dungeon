class AIControlSystem extends AbstractSystem {
    constructor() {
        super();
        this.requiredComponents = [AIControl, Position, Direction, Movement, Action];
        this.playerComponents = [KeyboardControls, Position];
        this.players = [];
    }

    before(entities, deltaTime) {
        this.players = [];

        entities.forEach(entity => {
            if (this.playerComponents.every(comp => entity.hasComponent(comp))) {
                this.players.push(entity);
            }
        });
    }

    updateForEntity(entity, deltaTime) {
        const movementComp = entity.getComponent(Movement);
        const directionComp = entity.getComponent(Direction);
        const aiControlComp = entity.getComponent(AIControl);
        const positionComp = entity.getComponent(Position);
        const actionComp = entity.getComponent(Action);

        switch (aiControlComp.type) {
            case AI_TYPE.RANDOM: this.random(
                movementComp,
                directionComp,
                actionComp,
                aiControlComp,
                deltaTime);
            break;

            case AI_TYPE.CLOSE_ATTACK: this.closeAttack(
                movementComp,
                directionComp,
                actionComp,
                aiControlComp,
                positionComp,
                deltaTime);
            break;
        }
    }

    random(movementComp, directionComp, actionComp, aiControlComp, deltaTime) {
        aiControlComp.movementTimer += deltaTime;

        if (aiControlComp.movementTimer < 1000) {
            return;
        }

        aiControlComp.movementTimer = 0;

        let horizontalDirection;
        let verticalDirection;

        const horizontalSeed = Math.floor(Math.random() * 3);
        const verticalSeed = Math.floor(Math.random() * 3);

        if (horizontalSeed === 0) {
            horizontalDirection = VELOCITY.HORIZONTAL.NONE;
        } else if (horizontalSeed === 1) {
            horizontalDirection = VELOCITY.HORIZONTAL.LEFT;
            directionComp.currentDirection = DIRECTION.LEFT;
        } else if (horizontalSeed === 2) {
            horizontalDirection = VELOCITY.HORIZONTAL.RIGHT;
            directionComp.currentDirection = DIRECTION.RIGHT;
        }

        if (verticalSeed === 0) {
            verticalDirection = VELOCITY.VERTICAL.NONE;
        } else if (verticalSeed === 1) {
            verticalDirection = VELOCITY.VERTICAL.UP;
        } else if (verticalSeed === 2) {
            verticalDirection = VELOCITY.VERTICAL.DOWN;
        }

        movementComp.veriticalVelocity = verticalDirection;
        movementComp.horizontalVelocity = horizontalDirection;

        if (horizontalDirection === VELOCITY.VERTICAL.NONE
            && verticalDirection === VELOCITY.VERTICAL.NONE) {
            actionComp.action = ACTION.IDLE;
        } else {
            actionComp.action = ACTION.WALK;
        }
    }

    closeAttack(movementComp, directionComp, actionComp, aiControlComp, positionComp, deltaTime) {
        for (const player of this.players) {
            let playerPositionComp = player.getComponent(Position);
            let xDist = playerPositionComp.x - positionComp.x;
            let yDist = playerPositionComp.y - positionComp.y;
            let dist = Math.sqrt(xDist * xDist + yDist * yDist);

            if (dist < 100) { // TODO make configurable?
                if (xDist < 0) {
                    directionComp.direction = DIRECTION.LEFT;
                    movementComp.horizontalVelocity = VELOCITY.HORIZONTAL.LEFT;
                } else {
                    directionComp.direction = DIRECTION.RIGHT;
                    movementComp.horizontalVelocity = VELOCITY.HORIZONTAL.RIGHT;
                }

                if (yDist < 0) {
                    movementComp.veriticalVelocity = VELOCITY.VERTICAL.UP;
                } else {
                    movementComp.veriticalVelocity = VELOCITY.VERTICAL.DOWN;
                }
            }
        }
    }
}