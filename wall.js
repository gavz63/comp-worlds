// Gordon McCreary (January 2020)

/** The additional scaling of layer 1. */
const WALL_A_SCALE = [1.04 * STANDARD_DRAW_SCALE];

/** The additional scaling of layer 2. */
const WALL_B_SCALE = [1.08 * STANDARD_DRAW_SCALE];

/** The additional scaling of layer 3. */
const WALL_C_SCALE = [1.12 * STANDARD_DRAW_SCALE];

/**
 * The Wall class is used to draw all the types of walls and doors.
 */
class Wall {

    /**
     * @param {GameEngine} game The game engine that this entity exists in.
     */
    constructor(game) {
        this._game = game;
        this._game.addEntity(this, "floor");
        this._level = this._game._level;
        this._wallSheet = ASSET_MANAGER.getAsset("./img/map/walls.png");
        this._doorSheet = ASSET_MANAGER.getAsset("./img/map/doors.png");
        this._removeFromWorld = false;

        this._outsideWall0 = new Animation(this._wallSheet, 128, 128, {x: 0, y: 0}, {x: 0, y: 0}, 0, true, STANDARD_DRAW_SCALE);
        this._insideWall0 = new Animation(this._wallSheet, 128, 128, {x: 0, y: 1}, {x: 0, y: 1}, 0, true, STANDARD_DRAW_SCALE);

        this._outsideWall1 = new Animation(this._wallSheet, 128, 128, {x: 1, y: 0}, {x: 1, y: 0}, 0, true, WALL_A_SCALE);
        this._insideWall1 = new Animation(this._wallSheet, 128, 128, {x: 1, y: 1}, {x: 1, y: 1}, 0, true, WALL_A_SCALE);
        this._outsideVDoor1 = new Animation(this._doorSheet, 128, 128, {x: 0, y: 0}, {x: 0, y: 0}, 0, true, WALL_A_SCALE);
        this._outsideHDoor1 = new Animation(this._doorSheet, 128, 128, {x: 0, y: 1}, {x: 0, y: 1}, 0, true, WALL_A_SCALE);
        this._insideVDoor1 = new Animation(this._doorSheet, 128, 128, {x: 0, y: 2}, {x: 0, y: 2}, 0, true, WALL_A_SCALE);
        this._insideHDoor1 = new Animation(this._doorSheet, 128, 128, {x: 0, y: 3}, {x: 0, y: 3}, 0, true, WALL_A_SCALE);

        this._outsideWall2 = new Animation(this._wallSheet, 128, 128, {x: 2, y: 0}, {x: 2, y: 0}, 0, true, WALL_B_SCALE);
        this._insideWall2 = new Animation(this._wallSheet, 128, 128, {x: 2, y: 1}, {x: 2, y: 1}, 0, true, WALL_B_SCALE);
        this._outsideVDoor2 = new Animation(this._doorSheet, 128, 128, {x: 1, y: 0}, {x: 1, y: 0}, 0, true, WALL_B_SCALE);
        this._outsideHDoor2 = new Animation(this._doorSheet, 128, 128, {x: 1, y: 1}, {x: 1, y: 1}, 0, true, WALL_B_SCALE);
        this._insideVDoor2 = new Animation(this._doorSheet, 128, 128, {x: 1, y: 2}, {x: 1, y: 2}, 0, true, WALL_B_SCALE);
        this._insideHDoor2 = new Animation(this._doorSheet, 128, 128, {x: 1, y: 3}, {x: 1, y: 3}, 0, true, WALL_B_SCALE);

        this._outsideWall3 = new Animation(this._wallSheet, 128, 128, {x: 3, y: 0}, {x: 3, y: 0}, 0, true, WALL_C_SCALE);
        this._insideWall3 = new Animation(this._wallSheet, 128, 128, {x: 3, y: 1}, {x: 3, y: 1}, 0, true, WALL_C_SCALE);
        this._outsideVDoor3 = new Animation(this._doorSheet, 128, 128, {x: 2, y: 0}, {x: 2, y: 0}, 0, true, WALL_C_SCALE);
        this._outsideHDoor3 = new Animation(this._doorSheet, 128, 128, {x: 2, y: 1}, {x: 2, y: 1}, 0, true, WALL_C_SCALE);
        this._insideVDoor3 = new Animation(this._doorSheet, 128, 128, {x: 2, y: 2}, {x: 2, y: 2}, 0, true, WALL_C_SCALE);
        this._insideHDoor3 = new Animation(this._doorSheet, 128, 128, {x: 2, y: 3}, {x: 2, y: 3}, 0, true, WALL_C_SCALE);
    }

    /**
     * Mandatory draw method; called by the GameEngine to draw the entity.
     * @param {*} ctx The canvas' 2D context.
     */
    draw(ctx) {

        // Layer 0.
        for (let i = 0; i < this._level._map.length; i++) {
            for (let j = 0; j < this._level._map[i].length; j++) {
                if (this._level._map[i][j] === "W") {
                    let pos = this._game._camera.drawPosTranslation({x: this._level.indexToCoordinate(i), y: this._level.indexToCoordinate(j)}, 1);
                    if (this._level._wallType === "0") {
                        this._outsideWall0.drawFrame(this._game._clockTick, ctx, pos.x, pos.y, true);
                    } else {
                        this._insideWall0.drawFrame(this._game._clockTick, ctx, pos.x, pos.y, true);
                    }
                }
            }
        }

        // Layer 1.
        for (let i = 0; i < this._level._map.length; i++) {
            for (let j = 0; j < this._level._map[i].length; j++) {
                let tile = this._level._map[i][j];
                if (tile === "W" || tile === "H" || tile === "V") {
                    let pos1 = this._game._camera.drawPosTranslation({x: this._level.indexToCoordinate(i), y: this._level.indexToCoordinate(j)}, (STANDARD_DRAW_SCALE * (.04 / 1.75)) + 1);
                    if (this._level._wallType === "0") {
                        if (tile === "W") this._outsideWall1.drawFrame(this._game._clockTick, ctx, pos1.x, pos1.y, true);
                        if (tile === "H") this._outsideHDoor1.drawFrame(this._game._clockTick, ctx, pos1.x, pos1.y, true);
                        if (tile === "V") this._outsideVDoor1.drawFrame(this._game._clockTick, ctx, pos1.x, pos1.y, true);
                    } else {
                        if (tile === "W") this._insideWall1.drawFrame(this._game._clockTick, ctx, pos1.x, pos1.y, true);
                        if (tile === "H") this._insideHDoor1.drawFrame(this._game._clockTick, ctx, pos1.x, pos1.y, true);
                        if (tile === "V") this._insideVDoor1.drawFrame(this._game._clockTick, ctx, pos1.x, pos1.y, true);
                    }
                }
            }
        }

        // Layer 2.
        for (let i = 0; i < this._level._map.length; i++) {
            for (let j = 0; j < this._level._map[i].length; j++) {
                let tile = this._level._map[i][j];
                if (tile === "W" || tile === "H" || tile === "V") {
                    let pos2 = this._game._camera.drawPosTranslation({x: this._level.indexToCoordinate(i), y: this._level.indexToCoordinate(j)}, (STANDARD_DRAW_SCALE * (.08 / 1.75)) + 1);
                    if (this._level._wallType === "0") {
                        if (tile === "W") this._outsideWall2.drawFrame(this._game._clockTick, ctx, pos2.x, pos2.y, true);
                        if (tile === "H") this._outsideHDoor2.drawFrame(this._game._clockTick, ctx, pos2.x, pos2.y, true);
                        if (tile === "V") this._outsideVDoor2.drawFrame(this._game._clockTick, ctx, pos2.x, pos2.y, true);
                    } else {
                        if (tile === "W") this._insideWall2.drawFrame(this._game._clockTick, ctx, pos2.x, pos2.y, true);
                        if (tile === "H") this._insideHDoor2.drawFrame(this._game._clockTick, ctx, pos2.x, pos2.y, true);
                        if (tile === "V") this._insideVDoor2.drawFrame(this._game._clockTick, ctx, pos2.x, pos2.y, true);
                    }
                }
            }
        }

        // Layer 3.
        for (let i = 0; i < this._level._map.length; i++) {
            for (let j = 0; j < this._level._map[i].length; j++) {
                let tile = this._level._map[i][j];
                if (tile === "W" || tile === "H" || tile === "V") {
                    let pos3 = this._game._camera.drawPosTranslation({x: this._level.indexToCoordinate(i), y: this._level.indexToCoordinate(j)}, (STANDARD_DRAW_SCALE * (.12 / 1.75)) + 1);
                    if (this._level._wallType === "0") {
                        if (tile === "W") this._outsideWall3.drawFrame(this._game._clockTick, ctx, pos3.x, pos3.y, true);
                        if (tile === "H") this._outsideHDoor3.drawFrame(this._game._clockTick, ctx, pos3.x, pos3.y, true);
                        if (tile === "V") this._outsideVDoor3.drawFrame(this._game._clockTick, ctx, pos3.x, pos3.y, true);
                    } else {
                        if (tile === "W") this._insideWall3.drawFrame(this._game._clockTick, ctx, pos3.x, pos3.y, true);
                        if (tile === "H") this._insideHDoor3.drawFrame(this._game._clockTick, ctx, pos3.x, pos3.y, true);
                        if (tile === "V") this._insideVDoor3.drawFrame(this._game._clockTick, ctx, pos3.x, pos3.y, true);
                    }
                }
            }
        }
    }

    /**
     * Mandatory update method; called by the GameEngine to update the entity.
     */
    update() {
        WALL_A_SCALE[0] = ((STANDARD_DRAW_SCALE * (.04 / 1.75) + 1) * STANDARD_DRAW_SCALE);
        WALL_B_SCALE[0] = ((STANDARD_DRAW_SCALE * (.08 / 1.75) + 1) * STANDARD_DRAW_SCALE);
        WALL_C_SCALE[0] = ((STANDARD_DRAW_SCALE * (.12 / 1.75) + 1) * STANDARD_DRAW_SCALE);
    }
}