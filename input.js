const keys = new Map();

window.addEventListener("keydown", function(event) {
    keys.set(event.code, true);
})

window.addEventListener("keyup", function(event) {
    keys.set(event.code, false);
})