const tilePickerCanvas = document.getElementById('tile-picker-canvas');
const tilePickerCtx = tilePickerCanvas.getContext('2d');

const selectedTileCanvas = document.getElementById('selected-tile-canvas');
const selectedTileCtx = selectedTileCanvas.getContext('2d');

const DELETE_TILE_ID = 'delete';
const VOID_TILE_ID = '11';
const editor = {
    selected: null,
    mouseDown: false,

    draw() {
        let mouseReleased = this.mouseDown && !mouse.down;
        this.mouseDown = mouse.down;

        this.drawTilePicker();
        let selectedTileCoords = this.getSelectedTileCoords(tilePickerCanvas);

        if (selectedTileCoords !== null) {
            this.highlightSelectedTile(selectedTileCoords, tilePickerCtx, 'Lime');

            if (mouseReleased) {
                this.updateSelectedTile(selectedTileCoords);
                this.drawPreview(selectedTileCoords);
                this.updateForm();
            }
        }

        let gameCanvasTileCoordinates = this.getSelectedTileCoords(gameCanvas);

        if (gameCanvasTileCoordinates !== null) {
            this.highlightSelectedTile(gameCanvasTileCoordinates, gameCtx, 'Red');

            if (mouseReleased && this.selected !== null) {
                this.updateMap(gameCanvasTileCoordinates);
            }
        }
    },

    drawTilePicker() {
        tilePickerCtx.fillStyle = 'AliceBlue';
        tilePickerCtx.fillRect(0, 0, TILE_PICKER_SIZE, TILE_PICKER_SIZE);

        tilePickerCtx.strokeStyle = 'Grey';
        tilePickerCtx.beginPath();

        for (let i = 1; i < TILE_PICKER_SIZE / TILE_SIZE; i++) {
            // Draw vertical lines
            tilePickerCtx.moveTo(i * TILE_SIZE, 0);
            tilePickerCtx.lineTo(i * TILE_SIZE, TILE_PICKER_SIZE);

            // Draw horizontal lines
            tilePickerCtx.moveTo(0, i * TILE_SIZE);
            tilePickerCtx.lineTo(TILE_PICKER_SIZE, i * TILE_SIZE);
        }

        tilePickerCtx.stroke();

        // Draw the tileset over the top
        tilePickerCtx.drawImage(tilesetImg, 0, 0);
    },

    getSelectedTileCoords(canvas) {
        const canvasX = mouse.x - canvas.offsetLeft;
        const canvasY = mouse.y - canvas.offsetTop;

        if (canvasX > 0 && canvasX < canvas.width &&
            canvasY > 0 && canvasY < canvas.height) {

            return {
                x: Math.floor(canvasX / TILE_SIZE),
                y: Math.floor(canvasY / TILE_SIZE),
            };
        }

        return null;
    },

    highlightSelectedTile(coords, ctx, color) {
        ctx.strokeStyle = color;

        ctx.strokeRect(
            coords.x * TILE_SIZE,
            coords.y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
        );
    },

    updateSelectedTile(selectedTileCoords) {
        let selected = null;

        for (let id in currentLevel.tiles) {
            const tile = currentLevel.tiles[id];
            if (selectedTileCoords.x === tile.x && selectedTileCoords.y === tile.y) {
                selected = { id: id, coords: selectedTileCoords };
            }
        }

        if (selected === null) {
            selected = {
                id: selectedTileCoords.x.toString(16) + selectedTileCoords.y.toString(16),
                coords: selectedTileCoords,
            };
        }

        this.selected = selected;
    },

    updateMap(coords) {
        let tile = currentLevel.tiles[this.selected.id];

        if (tile) {
            if (tile.name === DELETE_TILE_ID) {
                let didDelete = false;

                currentLevel.objects = currentLevel.objects.filter(obj => {
                        let match = obj.x === coords.x && obj.y === coords.y;
                        if (match) {
                            didDelete = true;
                        }

                        return !match;
                    }
                );

                if (!didDelete) {
                    currentLevel.map[coords.y][coords.x] = VOID_TILE_ID;
                }
            } else if (tile.isObj) {
                currentLevel.objects.push(
                    { type: 'tile', id: this.selected.id, x: coords.x, y: coords.y },
                );
            } else {
                currentLevel.map[coords.y][coords.x] = this.selected.id;
            }
        }
    },

    drawPreview(selectedTileCoords) {
        selectedTileCtx.fillStyle = 'AliceBlue';
        selectedTileCtx.fillRect(0, 0, selectedTileCanvas.width, selectedTileCanvas.height);

        selectedTileCtx.drawImage(
            tilesetImg,
            selectedTileCoords.x * TILE_SIZE, selectedTileCoords.y * TILE_SIZE,
            TILE_SIZE, TILE_SIZE,
            0, 0,
            TILE_SIZE * 4, TILE_SIZE * 4,
        );
    },

    updateForm() {
        let tile = currentLevel.tiles[this.selected.id];
        let name, passable, isObj;

        if (tile) {
            name = tile.name;
            passable = tile.pass;
            isObj = tile.isObj;
        }

        document.getElementById('tile-name').value = name;
        document.getElementById('tile-is-pass').checked = passable;
        document.getElementById('tile-is-obj').checked = isObj;
    },

    updateTileDetails(form) {
        const formData = new FormData(form);
        const name = formData.get('tile-name');
        const passable = formData.get('tile-is-pass');
        const isObject = formData.get('tile-is-obj');

        currentLevel.tiles[this.selected.id] = {
            name: name || 'unnamed',
            pass: passable || false,
            isObj: isObject || false,
            x: this.selected.coords.x,
            y: this.selected.coords.y,
        };
    },

    saveLevel(form) {
        const jsonStr = JSON.stringify(currentLevel);

        const blob = new Blob([jsonStr], { type: 'application/json' });

        const url = URL.createObjectURL(blob);
        const formData = new FormData(form);
        const levelName = formData.get('level-name') || 'unnamed-level.json';

        const a = document.createElement('a');
        a.href = url;
        a.download = levelName;
        document.body.appendChild(a);

        // Trigger the download
        a.click();

        // Clean up the revoked Blob URL
        URL.revokeObjectURL(url);

        // Remove the link element from the DOM
        document.body.removeChild(a);
    },

    loadLevel() {
        const fileInput = document.getElementById('load-level-file-input');
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = (event) => {
                currentLevel = JSON.parse(event.target.result);
            };

            reader.onerror = (event) => {
                console.error(event.target.result);
            };

            reader.readAsText(file);
        }
    },
};


document.getElementById('selected-tile-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission
    editor.updateTileDetails(event.target);
    event.target.reset();
});
document.getElementById('save-level-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission
    editor.saveLevel(event.target);
});

document.getElementById('load-level-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission
    editor.loadLevel();
});