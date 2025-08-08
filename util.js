let util = {
    detectAABBCollision(boundingBoxA, boundingBoxB) {
        // TODO - make this a URL param
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
            };

            if (this.detectAABBCollision(tileBoundingBox, objectBoundingBox)) {
                return tile;
            }
        }

        return false;
    },

    detectObjectCollision(boundingBox, obstacles) {
        for (const obstacle of obstacles) {
            const positionComp = obstacle.getComponent(Position);
            const sizeComp = obstacle.getComponent(Size);

            const obstacleBoundingBox = {
                x: positionComp.x,
                y: positionComp.y,
                width: sizeComp.width,
                height: sizeComp.height,
            }

            if (this.detectAABBCollision(obstacleBoundingBox, boundingBox)) {
                // TODO - add debug param
                // console.log(currentLevel.tiles[levelObject.id]);

                if (!sizeComp.passable) {
                    return obstacle;
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
            || this.detectTileCollision(mapRow + 1, mapCol + 1, boundingBox);
    },
};