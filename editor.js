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

        for (let id in level1.tiles) {
            const tile = level1.tiles[id];
            if (selectedTileCoords.x === tile.x && selectedTileCoords.y === tile.y) {
                selected = { id: id, coords: selectedTileCoords };
            }
        }

        if (selected === null) {
            selected = {
                id: selectedTileCoords.x.toString(16) + selectedTileCoords.y.toString(16),
                coords: selectedTileCoords,
            }
        }

        this.selected = selected;

        console.log(this.selected);
    },

    updateMap(coords) {
        let tile = level1.tiles[this.selected.id];

        if (tile) {
            level1.map[coords.y][coords.x] = this.selected.id;
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
        let tile = level1.tiles[this.selected.id];
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

        level1.tiles[this.selected.id] = {
            name: name,
            pass: passable,
            isObj: isObject,
            x: this.selected.coords.x,
            y: this.selected.coords.y,
        };
    }
};

document.getElementById('selected-tile-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission
    editor.updateTileDetails(event.target);
    event.target.reset();
})