const tileSelectorCanvas = document.getElementById('tile-selector-canvas');
const tileSelectorCtx = tileSelectorCanvas.getContext('2d');

const editor = {
    selectedTile: null,

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

    getSelectedTileCoords() {
        const localX = mouse.x - tileSelectorCanvas.offsetLeft;
        const localY = mouse.y - tileSelectorCanvas.offsetTop;

        if (localX > 0 && localX < tileSelectorCanvas.width &&
            localY > 0 && localY < tileSelectorCanvas.height) {

            return {
                x: Math.floor(localX / TILE_SIZE),
                y: Math.floor(localY / TILE_SIZE),
            };
        }

        return null;
    },

    highlightSelectedTile(coords) {
        tileSelectorCtx.strokeStyle = 'Lime';

        tileSelectorCtx.strokeRect(
            coords.x * TILE_SIZE,
            coords.y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
        );
    },

    updateSelectedTile(selectedTileCoords) {
        let selected = null;

        for (let tile of Object.values(level1.tiles)) {
            if (selectedTileCoords.x === tile.x && selectedTileCoords.y === tile.y) {
                selected = tile;
            }
        }

        if (selected !== null) {
            this.selectedTile = selected;
        }

        console.log(this.selectedTile);
    },

    draw() {
        this.drawTileSelector();
        let selectedTileCoords = this.getSelectedTileCoords();

        if (selectedTileCoords !== null) {
            this.highlightSelectedTile(selectedTileCoords);

            if (mouse.down) {
                this.updateSelectedTile(selectedTileCoords);
            }
        }
    },
};