let levelLoader = (level, ecs) => {
    tilesetImg.onload = () => {
        for (const obj of level.objects) {
            const tile = level.tiles[obj.id]

            const positionComp = new Position(obj.x * TILE_SIZE, obj.y * TILE_SIZE);
            const sizeComp = new Size(25, 25, tile.pass);

            if (!tile) {
                console.error(`Tile ${obj.id} not found`);
                break;
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
}
