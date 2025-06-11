const tileSelectorCanvas = document.getElementById('tile-selector-canvas');
const tileSelectorCtx = tileSelectorCanvas.getContext('2d');

const editor = {
    selectedTile: null,

    draw() {
        this.drawTileSelector();
        let selectedTileCoords = this.getSelectedTileCoords(tileSelectorCanvas);

        if (selectedTileCoords !== null) {
            this.highlightSelectedTile(selectedTileCoords, tileSelectorCtx, 'Lime');

            if (mouse.down) {
                this.updateSelectedTile(selectedTileCoords);
            }
        }

        let gameCanvasTileCoordinates = this.getSelectedTileCoords(gameCanvas);

        if (gameCanvasTileCoordinates !== null) {
            this.highlightSelectedTile(gameCanvasTileCoordinates, gameCtx, 'Red');

            if (mouse.down && this.selectedTile !== null) {
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
                selected = id;
            }
        }

        if (selected !== null) {
            this.selectedTile = selected;
        }

        console.log(this.selectedTile);
    },

    updateMap(tileCoords) {
        debugger;
        level1.map[tileCoords.y][tileCoords.x] = this.selectedTile;
    },
};