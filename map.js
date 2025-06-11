const map = {
    drawMap(level) {
        for (let y = 0; y < level.map.length; y++) {
            for (let x = 0; x < level.map[y].length; x++) {
                const tileId = level.map[y][x];
                const tile = level.tiles[tileId];

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
};