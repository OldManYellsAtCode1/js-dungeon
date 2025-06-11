const keys = new Map();
const mouse = { x: 0, y: 0, down: false };

window.addEventListener('keydown', function(event) {
    keys.set(event.code, true);
});

window.addEventListener('keyup', function(event) {
    keys.set(event.code, false);
});

window.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mousedown', function() {
    mouse.down = true;
});

window.addEventListener('mouseup', function() {
    mouse.down = false;
});