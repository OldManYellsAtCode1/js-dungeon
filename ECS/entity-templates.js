let entityTemplates = {
    getPlayerControls: () => {
        const controls = new Map();
        controls.set('ArrowRight', USER_COMMANDS.RIGHT);
        controls.set('ArrowLeft', USER_COMMANDS.LEFT);
        controls.set('ArrowUp', USER_COMMANDS.UP);
        controls.set('ArrowDown', USER_COMMANDS.DOWN);
        controls.set('Space', USER_COMMANDS.ATTACK);

        return new KeyboardControls(controls);
    },

    getPlayerAnimations: () => {
        const animationData = new Map();
        animationData.set(ACTION.IDLE, { frames: 4, row: 0, speed: 1 });
        animationData.set(ACTION.WALK, { frames: 6, row: 1, speed: 1 });
        animationData.set(ACTION.ATTACK, { frames: 3, row: 2, speed: 3 });

        return new Animations(
            knightImg,
            animationData,
            animationData.get(ACTION.IDLE),
            27,
            22,
            40,
            32,
        );
    },

    getSlimeAnimations: () => {
        const animationData = new Map();
        animationData.set(ACTION.IDLE, { frames: 4, row: 0, speed: 1 });
        animationData.set(ACTION.WALK, { frames: 3, row: 2, speed: 2 });
        animationData.set(ACTION.ATTACK, { frames: 3, row: 2, speed: 10 });

        return new Animations(
            slimeImg,
            animationData,
            animationData.get(ACTION.IDLE),
            24,
            24,
            24,
            24,
        );
    },

    getBatAnimations: () => {
        const animationData = new Map();
        animationData.set(ACTION.IDLE, { frames: 4, row: 0, speed: 1 });
        animationData.set(ACTION.WALK, { frames: 4, row: 0, speed: 2 });
        animationData.set(ACTION.ATTACK, { frames: 4, row: 0, speed: 10 });

        return new Animations(
            batImg,
            animationData,
            animationData.get(ACTION.IDLE),
            16,
            16,
            16,
            16,
        );
    },

    'player': (data) => {
        const actionComp = new Action(ACTION.IDLE);
        const positionComp = new Position(data.x, data.y);
        const sizeComp = new BoundingBox(4, 4, 20, 24);
        const directionComp = new Direction(null);
        const movementComp = new Movement(120);
        const damageComp = new Combat(10, COMBAT_TYPE.PLAYER, {x: 16, y: 0, width: 24, height: 16});
        const keyboardControlsComp = entityTemplates.getPlayerControls();
        const animationsComp = entityTemplates.getPlayerAnimations();

        const entity = world.createEntity('player');
        entity.addComponent(actionComp);
        entity.addComponent(positionComp);
        entity.addComponent(directionComp);
        entity.addComponent(keyboardControlsComp);
        entity.addComponent(movementComp);
        entity.addComponent(animationsComp);
        entity.addComponent(sizeComp);
        entity.addComponent(damageComp);
    },

    'slime': (data) => {
        const actionComp = new Action(ACTION.IDLE);
        const positionComp = new Position(data.x, data.y);
        const sizeComp = new BoundingBox(5, 5, 16, 16);
        const directionComp = new Direction(null);
        const movementComp = new Movement(80);
        const damageComp = new Combat(10, COMBAT_TYPE.MONSTER);
        const aiControlComp = new AIControl(AI_TYPE.RANDOM);
        const animationsComp = entityTemplates.getSlimeAnimations();

        const entity = world.createEntity('slime');
        entity.addComponent(actionComp);
        entity.addComponent(positionComp);
        entity.addComponent(directionComp);
        entity.addComponent(movementComp);
        entity.addComponent(aiControlComp);
        entity.addComponent(animationsComp);
        entity.addComponent(sizeComp);
        entity.addComponent(damageComp);
    },

    'bat': (data) => {
        const actionComp = new Action(ACTION.IDLE);
        const positionComp = new Position(data.x, data.y);
        const sizeComp = new BoundingBox(2, 2, 12, 12);
        const directionComp = new Direction(null);
        const movementComp = new Movement(50);
        const damageComp = new Combat(5, COMBAT_TYPE.MONSTER);
        const aiControlComp = new AIControl(AI_TYPE.CLOSE_ATTACK);
        const animationsComp = entityTemplates.getBatAnimations();

        const entity = world.createEntity('bat');
        entity.addComponent(actionComp);
        entity.addComponent(positionComp);
        entity.addComponent(directionComp);
        entity.addComponent(movementComp);
        entity.addComponent(aiControlComp);
        entity.addComponent(animationsComp);
        entity.addComponent(sizeComp);
        entity.addComponent(damageComp);
    },
};