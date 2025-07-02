let util = {
    detectAABBCollision(boundingBoxA, boundingBoxB) {
        gameCtx.strokeStyle = 'red';
        gameCtx.strokeRect(boundingBoxA.x, boundingBoxA.y, boundingBoxA.width, boundingBoxA.height);

        gameCtx.strokeStyle = 'green';
        gameCtx.strokeRect(boundingBoxB.x, boundingBoxB.y, boundingBoxB.width, boundingBoxB.height);

        const AisToTheRightOfB = boundingBoxA.x > boundingBoxB.x + boundingBoxB.width;
        const AisToTheLeftOfB = boundingBoxA.x + boundingBoxA.width < boundingBoxB.x;
        const AisAboveB = boundingBoxA.y + boundingBoxA.height < boundingBoxB.y;
        const AisBelowB = boundingBoxA.y > boundingBoxB.y + boundingBoxB.height;

        return !(AisToTheRightOfB
            || AisToTheLeftOfB
            || AisAboveB
            || AisBelowB);
    },

    getTile(row, col) {
        const tileId = currentLevel.map[row][col];
        return currentLevel.tiles[tileId];
    },

    detectTileCollision(mapRow, mapCol, objectBoundingBox) {
        const tile = this.getTile(mapRow, mapCol);

        if (!tile.pass) {
            const tileBoundingBox = {
                x: mapCol * TILE_SIZE,
                y: mapRow * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
            }

            if (this.detectAABBCollision(tileBoundingBox, objectBoundingBox)) {
                return tile;
            }
        }

        return false;
    },

    detectObjectCollision(boundingBox) {
        const OBJECT_SCALE_FACTOR = 0.8;
        const OBJECT_SCALED_OFFSET = (1 - OBJECT_SCALE_FACTOR) * TILE_SIZE;

        for (const levelObject of currentLevel.objects) {
            const tile = currentLevel.tiles[levelObject.id];

            const levelObjectBoundingBox = {
                x: (levelObject.x * TILE_SIZE) + OBJECT_SCALED_OFFSET,
                y: (levelObject.y * TILE_SIZE) + OBJECT_SCALED_OFFSET,
                width: TILE_SIZE - (2 * OBJECT_SCALED_OFFSET),
                height: TILE_SIZE - (2 * OBJECT_SCALED_OFFSET),
            }

            if (this.detectAABBCollision(levelObjectBoundingBox, boundingBox)) {
                console.log(currentLevel.tiles[levelObject.id]);

                if (!tile.pass) {
                    return levelObject;
                }
            }
        }

        return false;
    },

    detectMapCollision(boundingBox) {
        const mapRow = Math.floor(boundingBox.y / TILE_SIZE);
        const mapCol = Math.floor(boundingBox.x / TILE_SIZE);

        return this.detectTileCollision(mapRow, mapCol, boundingBox)
            || this.detectTileCollision(mapRow + 1, mapCol, boundingBox)
            || this.detectTileCollision(mapRow, mapCol + 1, boundingBox)
            || this.detectTileCollision(mapRow + 1, mapCol + 1, boundingBox)
            || this.detectObjectCollision(boundingBox)
    },
}