const tileSelectorCanvas = document.getElementById('tile-selector-canvas');
const tileSelectorCtx = tileSelectorCanvas.getContext('2d');

const selectedTileCanvas = document.getElementById('selected-tile-canvas');
const selectedTileCtx = selectedTileCanvas.getContext('2d');

const editor = {
    selected: null,

    draw() {
        this.drawTileSelector();
        let selectedTileCoords = this.getSelectedTileCoords(tileSelectorCanvas);

        if (selectedTileCoords !== null) {
            this.highlightSelectedTile(selectedTileCoords, tileSelectorCtx, 'Lime');

            if (mouse.down) {
                this.updateSelectedTile(selectedTileCoords);
                this.drawPreview(selectedTileCoords);
                this.updateForm();
            }
        }

        let gameCanvasTileCoordinates = this.getSelectedTileCoords(gameCanvas);

        if (gameCanvasTileCoordinates !== null) {
            this.highlightSelectedTile(gameCanvasTileCoordinates, gameCtx, 'Red');

            if (mouse.down && this.selected !== null) {
                this.updateMap(gameCanvasTileCoordinates);
            }
        }
    },

    drawTileSelector() {
        tileSelectorCtx.fillStyle = 'AliceBlue';
        tileSelectorCtx.fillRect(0, 0, TILE_SELECTOR_SIZE, TILE_SELECTOR_SIZE);

        tileSelectorCtx.strokeStyle = 'Grey';
        tileSelectorCtx.beginPath();

        for (let i = 1; i < TILE_SELECTOR_SIZE / TILE_SIZE; i++) {
            //draw vertical lines
            tileSelectorCtx.moveTo(i * TILE_SIZE, 0);
            tileSelectorCtx.lineTo(i * TILE_SIZE, TILE_SELECTOR_SIZE);

            //draw horizontal lines
            tileSelectorCtx.moveTo(0, i * TILE_SIZE);
            tileSelectorCtx.lineTo(TILE_SELECTOR_SIZE, i * TILE_SIZE);
        }

        tileSelectorCtx.stroke();

        tileSelectorCtx.drawImage(tilesetImg, 0, 0);
    },

    getSelectedTileCoords(canvas) {
        const localX = mouse.x - canvas.offsetLeft;
        const localY = mouse.y - canvas.offsetTop;

        if (localX > 0 && localX < canvas.width &&
            localY > 0 && localY < canvas.height) {

            return {
                x: Math.floor(localX / TILE_SIZE),
                y: Math.floor(localY / TILE_SIZE),
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

        console.log(this.selected);
    },

    updateMap(coords) {
        let tile = currentLevel.tiles[this.selected.id];

        if (tile) {
            currentLevel.map[coords.y][coords.x] = this.selected.id;
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