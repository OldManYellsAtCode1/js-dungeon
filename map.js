const map = {
    draw() {
        this.drawMap();
        this.drawObjects();
    },

    drawMap() {
        for (let y = 0; y < currentLevel.map.length; y++) {
            for (let x = 0; x < currentLevel.map[y].length; x++) {
                const tileId = currentLevel.map[y][x];
                const tile = currentLevel.tiles[tileId];

                const srcX = tile.x * TILE_SIZE;
                const srcY = tile.y * TILE_SIZE;

                const dstX = x * TILE_SIZE;
                const dstY = y * TILE_SIZE;

                gameCtx.drawImage(
                    tilesetImg,
                    srcX, srcY, TILE_SIZE, TILE_SIZE, // Source section on tileset canvas
                    dstX, dstY, TILE_SIZE, TILE_SIZE, // Destination on game canvas
                );
            }
        }
    },

    drawObjects() {
        currentLevel.objects.forEach(obj => {
            debugger;
            const tile = currentLevel.tiles[obj.id];

            const srcX = tile.x * TILE_SIZE;
            const srcY = tile.y * TILE_SIZE;

            const dstX = obj.x * TILE_SIZE;
            const dstY = obj.y * TILE_SIZE;

            gameCtx.drawImage(
                tilesetImg,
                srcX, srcY, TILE_SIZE, TILE_SIZE, // Source section on tileset canvas
                dstX, dstY, TILE_SIZE, TILE_SIZE, // Destination on game canvas
            );
        })
    },
};