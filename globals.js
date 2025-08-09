const DIRECTION = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
};

const VELOCITY = {
    HORIZONTAL: {
        NONE: 'NONE',
        LEFT: 'LEFT',
        RIGHT: 'RIGHT',
    },
    VERTICAL: {
        NONE: 'NONE',
        UP: 'UP',
        DOWN: 'DOWN',
    },
};

const STATE = {
    IDLE: 'IDLE',
    WALK: 'WALK',
    ATTACK: 'ATTACK',
};

const USER_COMMANDS = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UP: 'UP',
    DOWN: 'DOWN',
    ATTACK: 'ATTACK',
};

const AI_TYPE = {
    RANDOM: 'RANDOM',
    CLOSE_ATTACK: 'CLOSE_ATTACK',
}