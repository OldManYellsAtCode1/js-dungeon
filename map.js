const TILE_SIZE = 32;

const tilesetImg = new Image();
tilesetImg.src = 'assets/tileset-dungeon.png';

const map = {
    drawMap(level) {
        for (let y = 0; y < level.map.length; y++) {
            for (let x = 0; x < level.map[y].length; x++) {
                const tileId = level.map[y][x];
                const tile = level.tiles[tileId];

                const srcX = tile.x * TILE_SIZE;
                const srcY = tile.y * TILE_SIZE;

                ctx.drawImage(
                    tilesetImg,
                    srcX, srcY, TILE_SIZE, TILE_SIZE, // Source section on tileset canvas
                    x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, // Destination on game canvas
                );
            }
        }
    }
}