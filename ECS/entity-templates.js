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
        animationData.set(STATE.IDLE, { frames: 4, row: 0, speed: 1 });
        animationData.set(STATE.WALK, { frames: 6, row: 1, speed: 1 });
        animationData.set(STATE.ATTACK, { frames: 3, row: 2, speed: 3 });

        return new Animations(
            knightImg,
            animationData,
            animationData.get(STATE.IDLE),
            27,
            22,
            40,
            32,
        );
    },

    "player": (data) => {
        const positionComp = new Position(data.x, data.y);
        const sizeComp = new BoundingBox(4, 4, 20, 24);
        const directionComp = new Direction(null);
        const movementComp = new Movement(120);
        const keyboardControlsComp = entityTemplates.getPlayerControls();
        const animationsComp = entityTemplates.getPlayerAnimations();

        const heroEntity = world.createEntity();
        heroEntity.addComponent(positionComp);
        heroEntity.addComponent(directionComp);
        heroEntity.addComponent(keyboardControlsComp);
        heroEntity.addComponent(movementComp);
        heroEntity.addComponent(animationsComp);
        heroEntity.addComponent(sizeComp);
    }

}