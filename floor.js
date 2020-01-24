/**
 * The Floor class is used to draw all the types of floors.
 */
class Floor {
    constructor(game, spritesheet) {
        this._game = game;
        this._game.addEntity(this, "floor");
        this._level = this._game._level;
        this._spritesheet = spritesheet;
        this._removeFromWorld = false;
        this._dirtFloor = new Animation(spritesheet, 128, 128, {x: 0, y: 0}, {x: 0, y: 0}, 0, true, STANDARD_DRAW_SCALE);
        this._stoneFloor = new Animation(spritesheet, 128, 128, {x: 1, y: 0}, {x: 1, y: 0}, 0, true, STANDARD_DRAW_SCALE);
        this._tileFloor = new Animation(spritesheet, 128, 128, {x: 2, y: 0}, {x: 2, y: 0}, 0, true, STANDARD_DRAW_SCALE);
        this._woodFloor = new Animation(spritesheet, 128, 128, {x: 3, y: 0}, {x: 3, y: 0}, 0, true, STANDARD_DRAW_SCALE);
    }

    draw(ctx) {
        for (let i = 0; i < this._level._map.length; i++) {
            for (let j = 0; j < this._level._map[i].length; j++) {
                if (this._level._map[i][j] === "F" || this._level._map[i][j] === "S") {
                    let pos = this._game._camera.translate({x: this._level.indexToCoordinate(i), y: this._level.indexToCoordinate(j)});
                    if (this._level._floorType === "0") {
                        this._dirtFloor.drawFrame(this._game._clockTick, ctx, pos.x, pos.y, true);
                    } else if (this._level._floorType === "1") {
                        this._stoneFloor.drawFrame(this._game._clockTick, ctx, pos.x, pos.y, true);
                    } else if (this._level._floorType === "2") {
                        this._tileFloor.drawFrame(this._game._clockTick, ctx, pos.x, pos.y, true);
                    } else {
                        this._woodFloor.drawFrame(this._game._clockTick, ctx, pos.x, pos.y, true);
                    }
                }
            }
        }
    }

    // Do nothing.
    update() {}
}