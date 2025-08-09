function loadLevel(level, ecs) {
    for (const entity of level.entities) {
        switch (entity.type) {
            case 'tile' : {
                loadTile(entity);
                break;
            }

            default : {
                entityTemplates[entity.type](entity);
                break;
            }
        }
    }

    function loadTile(entity) {
        const tile = level.tiles[entity.id];

        const positionComp = new Position(entity.x * TILE_SIZE, entity.y * TILE_SIZE);
        const sizeComp = new BoundingBox(3, 3, 26, 26, tile.pass);

        if (!tile) {
            console.error(`Tile ${entity.id} not found`);
        }

        const staticImage = new StaticImage(
            tilesetImg,
            tile.x * TILE_SIZE, tile.y * TILE_SIZE,
            TILE_SIZE, TILE_SIZE);

        const objEntity = ecs.createEntity();
        objEntity.addComponent(positionComp);
        objEntity.addComponent(sizeComp);
        objEntity.addComponent(staticImage);
    }
}