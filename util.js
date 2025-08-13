let util = {
    detectAABBCollision(boundingBoxA, boundingBoxB) {
        // TODO - make this a URL param
        // gameCtx.strokeStyle = 'red';
        // gameCtx.strokeRect(boundingBoxA.x, boundingBoxA.y, boundingBoxA.width, boundingBoxA.height);
        //
        // gameCtx.strokeStyle = 'green';
        // gameCtx.strokeRect(boundingBoxB.x, boundingBoxB.y, boundingBoxB.width, boundingBoxB.height);

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

    detectObjectCollisions(boundingBox, obstacles) {
        let hits = [];

        for (const obstacle of obstacles) {
            const positionComp = obstacle.getComponent(Position);
            const boundingBoxComp = obstacle.getComponent(BoundingBox);

            const obstacleBoundingBox = {
                x: positionComp.x + boundingBoxComp.offsetX,
                y: positionComp.y + boundingBoxComp.offsetY,
                width: boundingBoxComp.width,
                height: boundingBoxComp.height,
            };

            if (this.detectAABBCollision(obstacleBoundingBox, boundingBox)) {
                hits.push(obstacle);
            }
        }

        return hits;
    },

    detectMapCollision(boundingBox) {
        const mapRow = Math.floor(boundingBox.y / TILE_SIZE);
        const mapCol = Math.floor(boundingBox.x / TILE_SIZE);

        return this.detectTileCollision(mapRow, mapCol, boundingBox)
            || this.detectTileCollision(mapRow + 1, mapCol, boundingBox)
            || this.detectTileCollision(mapRow, mapCol + 1, boundingBox)
            || this.detectTileCollision(mapRow + 1, mapCol + 1, boundingBox);
    },

    loadImages(imagesWithPaths) {
        const loadPromises = imagesWithPaths.map(([img, path]) => {
            return new Promise((resolve, reject) => {
                img.src = path;

                img.onload = () => resolve();
                img.onerror = () => reject(new Error(`Failed to load image at ${path}`));
            });
        });

        return Promise.all(loadPromises);
    },
};